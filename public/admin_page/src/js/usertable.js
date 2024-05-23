$(document).ready(function () {
    const page_max = 10; // 페이지 당 최대 정보
    let exData = []; // 전체 사용자 데이터
    let defaultPage = 1; // 기본 페이지
    let filteredData = []; // 검색된 사용자 데이터
  
    const pagesPerGroup = 10; // 한 번에 보여줄 페이지 번호 그룹의 크기
    let currentPageGroup = 1; // 현재 페이지 번호 그룹

    // 페이지 갯수 구하기
    const allPageCount = () => {
        return Math.ceil(exData.length / page_max);
    };

    const listNum = document.querySelector('.num_wrap');

    // 페이지 번호 설정
    const setPageNum = () => {
        listNum.innerHTML = ''; // 페이지 번호 내부를 비움

        const totalPages = allPageCount();

        // 현재 페이지 그룹의 시작 페이지와 끝 페이지 계산
        const startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
        const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

        // 이전 페이지 그룹 버튼 생성
        if (currentPageGroup > 1) {
            listNum.innerHTML += `<span class="prevGroup">이전</span>`;
        }

        // 페이지 번호를 현재 페이지 그룹에 맞게 표시
        for (let i = startPage; i <= endPage; i++) {
            listNum.innerHTML += `<div class="numButton ${i === defaultPage ? 'selected' : ''}" data-page="${i}"><div class='num'>${i}</div></div>`;
        }

        // 다음 페이지 그룹 버튼 생성
        if (endPage < totalPages) {
            listNum.innerHTML += `<div class="nextGroup">다음</div>`;
        }

        addEventListenersToPageButtons();
    };

    const usertable = document.querySelector('#usertable');

    // 페이지 설정
    const setPage = (pageNumber) => {
        usertable.innerHTML = ''; // 페이지 리스트를 초기화

        for (
            let i = page_max * (pageNumber - 1);
            i < page_max * pageNumber && i < exData.length;
            i++
        ) {
            let user = exData[i];
            let newElements = `
                <tr>
                    <td>${user._id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.hp}</td>
                    <td>${user.addr1}</td>
                    <td>${user.addr2}</td>
                </tr>`;
            usertable.innerHTML += newElements;
        }
    };

    const addEventListenersToPageButtons = () => {
        const pageNumberButtons = document.querySelectorAll('.numButton');
        const prevGroupButton = document.querySelector('.prevGroup');
        const nextGroupButton = document.querySelector('.nextGroup');

        pageNumberButtons.forEach((numberButton) => {
            numberButton.addEventListener('click', (e) => {
                const pageNumber = +e.target.closest('.numButton').dataset.page;
                setPage(pageNumber);
                defaultPage = pageNumber;
                setPageNum();
                setSelectedPage();
            });
        });

        // 이전 페이지 그룹 버튼 클릭 이벤트 처리
        if (prevGroupButton) {
            prevGroupButton.addEventListener('click', () => {
                currentPageGroup--;
                setPageNum();
            });
        }

        // 다음 페이지 그룹 버튼 클릭 이벤트 처리
        if (nextGroupButton) {
            nextGroupButton.addEventListener('click', () => {
                currentPageGroup++;
                setPageNum();
            });
        }
    };

    // 선택된 페이지에 스타일 적용
    const setSelectedPage = () => {
        const pageNumberButtons = document.querySelectorAll('.numButton');
        pageNumberButtons.forEach((button) => {
            button.classList.remove('selected');
            if (parseInt(button.dataset.page) === defaultPage) {
                button.classList.add('selected');
            }
        });
    };

    // 좌우 버튼을 통한 페이지 이동
    const prevButton = document.querySelector('.prev_bt');
    const nextButton = document.querySelector('.next_bt');

    prevButton.addEventListener('click', () => {
        if (defaultPage > 1) {
            defaultPage -= 1;
            setPage(defaultPage);
            setSelectedPage();
            setPageNum();
        }
    });

    nextButton.addEventListener('click', () => {
        if (defaultPage < allPageCount()) {
            defaultPage += 1;
            setPage(defaultPage);
            setSelectedPage();
            setPageNum();
        }
    });

    // 페이지 로드 시 사용자 데이터 가져오기
    $.ajax({
        url: '/admin/api/user', // 서버에서 사용자 데이터를 가져올 엔드포인트
        method: 'GET',
        success: function (data) {
            exData = data.users; // 예: { users: [{ username: 'user1', userid: '123', ... }, { ... }] }
            console.log(exData);
            setPageNum(); // 페이지 번호 설정
            setPage(defaultPage); // 초기 페이지 설정
            setSelectedPage(); // 선택된 페이지 스타일 적용
        },
        error: function (err) {
            console.error('Error fetching user data:', err);
        }
    });

    // 사용자 데이터를 정렬
    const sortData = (column, order) => {
        exData.sort((a, b) => {
            if (order === 'asc') {
                return a[column] > b[column] ? 1 : -1;
            } else {
                return a[column] < b[column] ? 1 : -1;
            }
        });
    };

    $('.sortable').click(function () {
        const column = $(this).data('column');
        const order = $(this).data('order');
        sortData(column, order);
        setPage(defaultPage); // 정렬 후 현재 페이지 재설정
        setSelectedPage(); // 페이지 색상 재설정
        $(this).data('order', order === 'asc' ? 'desc' : 'asc'); // 정렬 순서 토글
    });

   // 검색 버튼 클릭 이벤트
$('#searchButton').click(function () {
    // 선택된 열의 인덱스
    const selectedIndex = $('#exampleFormControlSelect3').val();
    // 검색어
    const searchText = $('#searchInput').val().toLowerCase();

    // 사용자 데이터를 검색어와 선택된 열을 기준으로 필터링
    filteredData = exData.filter(user => {
        // 선택된 열의 값을 소문자로 변환하여 검색어가 포함되는지 확인
        return user[Object.keys(user)[selectedIndex]].toString().toLowerCase().includes(searchText);
    });

    // 검색 시 첫 페이지로 이동
    defaultPage = 1;
    // 페이지 그룹도 첫 번째 그룹으로 초기화
    currentPageGroup = 1;
    // 페이지 번호 설정
    setPageNum();
    // 검색 결과를 표에 표시
    setPage(defaultPage);
});



});
