$(document).ready(function () {
    const page_max = 25; // 페이지 당 최대 정보
    let exData = []; // 전체 사용자 데이터
    let defaultPage = 1; // 기본 페이지

    const pagesPerGroup = 20; // 한 번에 보여줄 페이지 번호 그룹의 크기
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

    const upsotable = document.querySelector('#exemplaryupso');

    // 페이지 설정
    const setPage = (pageNumber) => {
        upsotable.innerHTML = ''; // 페이지 리스트를 초기화

        for (
            let i = page_max * (pageNumber - 1);
            i < page_max * pageNumber && i < exData.length;
            i++
        ) {
            let upso = exData[i];
            let upsoname = upso.name.length>=9?upso.name.substr(0,8)+'...':upso.name;
            let addrs = upso.addr.split(' ')
            let upsoaddr = upso.addr.length>=10?addrs[0]+' '+addrs[1]+'...':upso.addr
            let newElements = `
            <tr>
                <td>${upso._id}</td>
                <td>${upso.no}</td>
                <td>${upso.date}</td>
                <td>${upsoname}</td>
                <td>${upso.type}</td>
                <td>${upso.tel}</td>
                <td>${upsoaddr}</td>
                
            </tr>`;
            upsotable.innerHTML += newElements;
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
        url: '/admin/api/upso', // 서버에서 사용자 데이터를 가져올 엔드포인트
        method: 'GET',
        success: function (data) {
            exData = data.exemplary;
            console.log('exData : ', exData)
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
});
