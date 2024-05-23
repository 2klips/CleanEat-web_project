document.addEventListener('DOMContentLoaded', function() {
    if (performance.navigation.type === 1) {
        localStorage.removeItem('searchResults');
        localStorage.removeItem('searchKeyword');
        localStorage.removeItem('searchCollection');
        localStorage.removeItem('searchRank');
        localStorage.removeItem('addresses');
        sessionStorage.removeItem('searchResults');
        sessionStorage.removeItem('searchKeyword');
        sessionStorage.removeItem('searchCollection');
        sessionStorage.removeItem('searchRank');
        sessionStorage.removeItem('addresses');
    }

    const searchBtn = document.getElementById('search-btn');
    const searchbox = document.getElementById('search');

    async function displayData(datas, containerId = 'slide') {
        const container = document.getElementById(containerId);
        
        container.innerHTML = ''; // 이전 데이터를 지웁니다.
        const empty = document.createElement('div');
        empty.id = 'slide-empty';
        container.appendChild(empty);

        // 마커와 오버레이 제거 함수 호출
        clearMarkersAndOverlays();

        const addresses = [];

        if (datas && Array.isArray(datas)) {
            datas.forEach(item => {
                if (!item || Object.keys(item).length === 0) {
                    return;
                }

                if (item.addr) {
                    addresses.push({
                        addr: item.addr,
                        name: item.name || '',
                        rank: item.rank || '',
                        tel: item.tel || '',
                        detail: item.detail || '',
                        violation: item.detail ? true : false
                    });

                    let starImg = '';
                    if (item.rank === '매우우수') {
                        starImg = './css/images/3star.svg';
                    } else if (item.rank === '우수') {
                        starImg = './css/images/2star.svg';
                    } else if (item.rank === '좋음') {
                        starImg = './css/images/1star.svg';
                    }

                    let tel = item.tel || '';
                    if (tel.includes('*')) {
                        tel = '';
                    } else {
                        tel = tel.replace(/\s+/g, '-'); // 숫자 사이에 빈칸이 있으면 "-"로 대체
                        if (tel.startsWith('02')) {
                            if (tel.length === 9) {
                                tel = tel.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
                            } else {
                                tel = tel.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                            }
                        } else if (tel.length <= 8) {
                            tel = '';
                        } else if (tel.startsWith('000')) {
                            tel = '';
                        }
                    }

                    const slideItem = document.createElement('div');
                    slideItem.classList.add('slide-content');

                    if (item.detail) {
                        slideItem.classList.add('violation');
                    }

                    let slideContent = `<h2>${item.name}`;

                    if (item.detail) {
                        slideContent += ` <img src="./css/images/alert_circle_outline_icon_red.png" alt="위반" class="violation-icon">`;
                    } else if (!item.detail && !item.rank) {
                        slideContent += ` <span class="exemplary-text"><img src="./css/images/Logo.png" alt="모범음식점" class="exemplary-icon"> 클린잇 - 모범음식점</span>`;
                    }

                    slideContent += `</h2>
                                    <p id="addr">${item.addr}</p>`;

                    if (tel) {
                        slideContent += `<p id="tel">연락처 : ${tel}</p>`;
                    }
                    if (item.rank) {
                        slideContent += `<p id="rank">위생등급 : ${item.rank}</p>
                                        <img src="${starImg}" alt="${item.rank}" class="star-img">`;
                    }
                    if (item.detail) {
                        slideContent += `<p id="detail">위반내용 : ${item.detail}</p>`;
                    }

                    slideItem.innerHTML = slideContent;
                    container.appendChild(slideItem);
                }
            });

            const center = getMapCenter();
            const sortedAddresses = sortResultsByDistance(addresses, center);
            const limitedAddresses = sortedAddresses.slice(0, MAX_MARKERS + zoomLevel * 5);

            localStorage.setItem('addresses', JSON.stringify(limitedAddresses));
            addMarkers(limitedAddresses, true);
        } else {
            console.error('데이터가 없습니다.');
        }
    }

    async function search(containerId = 'slide') {
        scrollToTop();
        const keyword = searchbox.value;
        const checkboxes = document.querySelectorAll('.search-check:checked');
        const rank = document.querySelectorAll('.rank:checked');
        const collection = [];
        checkboxes.forEach(checkbox => {
            collection.push(checkbox.value);
        });
        if (!keyword) {
            console.error('검색어를 입력하세요.');
            alert('검색어를 입력하세요.');
            return;
        }
        let rans = [];
        rank.forEach(rank => {
            rans.push(rank.value);
        });
        let query = {
            $and: [
                {
                    $or: [
                        { addr: { $regex: keyword, $options: 'i' } }, // 'i' 옵션은 대소문자 구분 없이 검색하도록 합니다.
                        { name: { $regex: keyword, $options: 'i' } }
                    ]
                },
            ]
        };
        if (rans.length > 0) {
            query.$and.push({ rank: { $in: rans } });
        }
        try {
            const queryString = encodeURIComponent(JSON.stringify(query));
            const response = await fetch(`http://localhost:8080/main/search?collection=${collection}&query=${queryString}`);
            if (!response.ok) {
                throw new Error('서버 응답에 문제가 발생했습니다.');
            }
            const data = await response.json();

            sessionStorage.setItem('searchResults', JSON.stringify(data));
            sessionStorage.setItem('searchKeyword', keyword);
            sessionStorage.setItem('searchCollection', JSON.stringify(collection));
            sessionStorage.setItem('searchRank', JSON.stringify(rans));

            displayData(data, containerId);
        } catch (error) {
            console.error('데이터를 불러오는 중 오류가 발생했습니다.', error);
        }
    }

    // 마커를 추가하는 함수
    function addMarkers(addressData, shouldRecenter) {
        clearMarkersAndOverlays();
        addressData.forEach((data, index) => {
            searchAndDisplayAddress(data, shouldRecenter && index === 0);
        });
    }


    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const savedResults = sessionStorage.getItem('searchResults');
    const savedKeyword = sessionStorage.getItem('searchKeyword');
    const savedCollection = sessionStorage.getItem('searchCollection');
    const savedRank = sessionStorage.getItem('searchRank');
    const savedAddresses = localStorage.getItem('addresses');

    if (savedResults && savedKeyword && savedCollection && savedRank) {
        const results = JSON.parse(savedResults);
        const keyword = savedKeyword;
        const collection = JSON.parse(savedCollection);
        const rank = JSON.parse(savedRank);

        searchbox.value = keyword;
        document.querySelectorAll('.search-check').forEach(checkbox => {
            checkbox.checked = collection.includes(checkbox.value);
        });
        document.querySelectorAll('.rank').forEach(rankBox => {
            rankBox.checked = rank.includes(rankBox.value);
        });

        displayData(results);
    }

    if (savedAddresses) {
        const addresses = JSON.parse(savedAddresses);
        addMarkers(addresses, true);
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', async function() {
            if (searchBtn.disabled) {
                console.log("서버 통신 중");
                return;
            }
            searchBtn.disabled = true;
            await search();
            searchBtn.disabled = false;
        });
    }

    if (searchbox) {
        searchbox.addEventListener('keypress', async function(event) {
            if (event.key === 'Enter') {
                if (searchBtn.disabled) {
                    console.log("서버 통신 중");
                    return;
                }
                searchBtn.disabled = true;
                await search();
                searchBtn.disabled = false;
            }
        });
    }

    if (typeof map !== 'undefined') {
        map.addListener('zoom_changed', function() {
            zoomLevel = map.getLevel();
            updateOverlaysVisibility();
        });
    }

    

    // 마커와 오버레이를 제거하는 함수
    function clearMarkersAndOverlays() {
        if (Array.isArray(markers)) {
            markers.forEach(marker => marker.setMap(null));
            markers = [];
        }
        if (Array.isArray(overlays)) {
            overlays.forEach(overlay => overlay.setMap(null));
            overlays = [];
        }
    }

    window.search = search;
    window.displayData = displayData;
    window.clearMarkersAndOverlays = clearMarkersAndOverlays;
});
