document.addEventListener('DOMContentLoaded', function() {

    const searchBtn = document.getElementById('search-btn');
    const searchbox = document.getElementById('search');

    // 페이지 로드 시 localStorage 초기화
    localStorage.removeItem('searchResults');
    localStorage.removeItem('searchKeyword');
    localStorage.removeItem('searchCollection');
    localStorage.removeItem('searchRank');

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
        // 체크된 체크박스의 값을 저장할 배열을 생성합니다.
        const collection = [];
        // 각 체크된 체크박스의 값을 배열에 추가합니다.
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
                // 응답이 성공적이지 않을 경우 오류를 throw하여 catch 블록으로 이동
                throw new Error('서버 응답에 문제가 발생했습니다.');
            }
            // JSON 형식으로 받은 응답 데이터를 파싱
            const data = await response.json();
            
            // 화면에 데이터를 표시하는 함수 호출
            displayData(data);

            // 검색 결과와 조건을 localStorage에 저장
            localStorage.setItem('searchResults', JSON.stringify(data));
            localStorage.setItem('searchKeyword', keyword);
            localStorage.setItem('searchCollection', JSON.stringify(collection));
            localStorage.setItem('searchRank', JSON.stringify(rans));


        } catch (error) {
            // 오류가 발생하면 콘솔에 오류 메시지 출력
            console.error('데이터를 불러오는 중 오류가 발생했습니다.', error);
        }
    }

    // 페이지 상단으로 스크롤하는 함수
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    // 페이지 로드 시 localStorage 초기화
    localStorage.removeItem('searchResults');
    localStorage.removeItem('searchKeyword');
    localStorage.removeItem('searchCollection');
    localStorage.removeItem('searchRank');


    // localStorage에서 검색 결과 복원
    const savedResults = localStorage.getItem('searchResults');
    const savedKeyword = localStorage.getItem('searchKeyword');
    const savedCollection = localStorage.getItem('searchCollection');
    const savedRank = localStorage.getItem('searchRank');
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
