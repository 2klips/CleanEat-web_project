document.addEventListener('DOMContentLoaded', function() {

    // 페이지 새로고침 여부 확인
    if (performance.navigation.type === 1) { // 1은 새로고침을 의미함
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

    // 데이터를 화면에 표시하는 함수
    async function displayData(datas) {
        const container = document.getElementById('slide');
        container.innerHTML = ''; // 이전 데이터를 지웁니다.
        const empty = document.createElement('div');
        empty.id = 'slide-empty';
        container.appendChild(empty);

        clearMarkersAndOverlays(); // 기존 마커와 오버레이 제거

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

                    // Rank에 따른 이미지 선택
                    let starImg = '';
                    if (item.rank === '매우우수') {
                        starImg = './css/images/3star.svg';
                    } else if (item.rank === '우수') {
                        starImg = './css/images/2star.svg';
                    } else if (item.rank === '좋음') {
                        starImg = './css/images/1star.svg';
                    }

                    // 전화번호 처리
                    let tel = item.tel || '';
                    if (tel.includes('*')) {
                        tel = '';
                    } else if (tel.startsWith('02')) {
                        tel = tel.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                    }

                   // slide에 데이터 출력
                    const slideItem = document.createElement('div');
                    slideItem.classList.add('slide-content');
                    slideItem.innerHTML = `
                        <h2>${item.name}</h2>
                        <p id="addr">${item.addr}</p>
                        <p id="tel">${tel}</p>
                        <p id="rank">위생등급 :${item.rank}</p>
                        <img src="${starImg}" alt="${item.rank}" class="star-img">
                    `;
                    container.appendChild(slideItem);
                }
            });

            const center = getMapCenter();
            const sortedAddresses = sortResultsByDistance(addresses, center);
            const limitedAddresses = sortedAddresses.slice(0, MAX_MARKERS + zoomLevel * 5);

            // localStorage에 마커와 인포윈도우 데이터를 저장
            localStorage.setItem('addresses', JSON.stringify(limitedAddresses));
            addMarkers(limitedAddresses, true);

        } else {
            console.error('데이터가 없습니다.');
        }
    }

    // 마커를 추가하는 함수
    function addMarkers(addressData, shouldRecenter) {
        clearMarkersAndOverlays();
        addressData.forEach((data, index) => {
            searchAndDisplayAddress(data, shouldRecenter && index === 0);
        });
    }

    // 검색어를 서버에 전송하여 데이터를 검색하는 함수
    async function search() {
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

            // 검색 결과와 조건을 sessionStorage에 저장
            sessionStorage.setItem('searchResults', JSON.stringify(data));
            sessionStorage.setItem('searchKeyword', keyword);
            sessionStorage.setItem('searchCollection', JSON.stringify(collection));
            sessionStorage.setItem('searchRank', JSON.stringify(rans));

            // 화면에 데이터를 표시하는 함수 호출
            displayData(data);
        } catch (error) {
            console.error('데이터를 불러오는 중 오류가 발생했습니다.', error);
        }

    }

    // 페이지 상단으로 스크롤하는 함수
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // localStorage에서 검색 결과 복원
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
        // 복원된 검색 조건에 따라 체크박스 상태 업데이트
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

    // 검색 버튼 클릭 시 실행되는 이벤트 리스너
    if (searchBtn) {
        searchBtn.addEventListener('click', async function() {
            if(searchBtn.disabled) {
                console.log("서버 통신 중");
                return;
            }
            searchBtn.disabled = true;
            await search();
            searchBtn.disabled = false;
        });
    }

    // 검색어 입력 필드에서 Enter 키 입력 시 실행되는 이벤트 리스너
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

    // 지도 줌 레벨 변경 시 실행되는 이벤트 리스너
    if (typeof map !== 'undefined') {
        map.addListener('zoom_changed', function() {
            zoomLevel = map.getLevel();
            updateOverlaysVisibility();
        });
    }
});
