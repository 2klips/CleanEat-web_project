
const searchBtn = document.getElementById('search-btn');
const searchbox = document.getElementById('search');
const searchfilter = document.getElementById('search-btn');
/**
 * 데이터를 화면에 표시하는 함수
 * @param {Object} datas 화면에 표시할 데이터 객체
 */
async function displayData(datas) {
    const container = document.getElementById('data-container');
    container.innerHTML = ''; // 이전 데이터를 지웁니다.

    if (datas && Array.isArray(datas)) {
        datas.forEach(item => {
            let 
            rank = '';
            console.log(item)
            if(item.rank == '매우우수'){
                rank = `<div class="star"><h3>위생등급: 매우우수<img src="./css/images/3star.svg" class="3star"></h3></div>`;
            }else if(item.rank == '우수'){
                rank = `<div class="star"><h3>위생등급: 우수<img src="./css/images/2star.svg" class="2star"></h3></div>`;
            }else if(item.rank == '좋음'){
                rank = `<div class="star"><h3>위생등급: 좋음<img src="./css/images/1star.svg" class="1star"></h3></div>`;
            }

            // 각 식당 정보를 화면에 출력합니다.
            const itemElement = document.createElement('div');
            itemElement.classList.add('content');
            // let itemHTML = '<div class="content">';
            let itemHTML = '<div class="content-info">';
            itemHTML += `<h2>${item.name}</h2>`; // 식당명
            itemHTML += `<p>${item.type}</p>`; // 업태명
            itemHTML += `<p>${item.category}</p>`; // 업종
            itemHTML += rank; // 위생등급
            itemHTML += `<p>${item.detail}</p><br>`                   
            itemHTML += `<p>${item.name}</p><br>`                   
            itemHTML += `<p>${item.penalty}</p><br>`                   
            itemHTML += `<p>${item.date}</p><br>`; // 지정일자
            itemHTML += `<p>${item.addr}</p><br>`; // 주소
            itemHTML += `<p>${item.tel}</p><br>`; // 전화번호
            itemHTML += '</div>';
            itemElement.innerHTML = itemHTML;
            container.appendChild(itemElement);
        });
    } else {
        console.error('데이터가 없습니다.');
    }
}




async function search() {
    const keyword = searchbox.value;

    const checkboxes = document.querySelectorAll('.search-check:checked');
    // 체크된 체크박스의 값을 저장할 배열을 생성합니다.
    const collection = [];
    // 각 체크된 체크박스의 값을 배열에 추가합니다.
    checkboxes.forEach(checkbox => {
        collection.push(checkbox.value);
    });
    if (!keyword) {
        console.error('검색어를 입력하세요.');
        return;
    }else if (collection.length === 0) {
        console.error('검색할 데이터를 선택하세요.');
        return;
    }
    
    try {
        const response = await fetch(`/main/list/search?collection=${collection}&keyword=${keyword}`);
        if (!response.ok) {
            // 응답이 성공적이지 않을 경우 오류를 throw하여 catch 블록으로 이동
            throw new Error('서버 응답에 문제가 발생했습니다.');
        }

        // JSON 형식으로 받은 응답 데이터를 파싱
        const data = await response.json();
        console.log(data);
        // 화면에 데이터를 표시하는 함수 호출
        displayData(data);
    } catch (error) {
        // 오류가 발생하면 콘솔에 오류 메시지 출력
        console.error('데이터를 불러오는 중 오류가 발생했습니다.', error);
    }
}
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}



// 검색 버튼 클릭 시 실행되는 이벤트 리스너
searchBtn.addEventListener('click', async function() {
    if(searchBtn.disabled) {
        console.log("서버 통신 중");
        return;
    };
    searchBtn.disabled = true;
    await search();
    searchBtn.disabled = false;
});

// 검색어 입력 필드에서 Enter 키 입력 시 실행되는 이벤트 리스너
searchbox.addEventListener('keypress', async function(event) {
    if (searchBtn.disabled) {
        console.log("서버 통신 중");
        return;
    };
    searchBtn.disabled = true;
    if (event.key === 13) {
        await search();
    }
    searchBtn.disabled = false;
});
