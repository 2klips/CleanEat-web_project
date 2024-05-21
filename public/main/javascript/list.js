const searchBtn = document.getElementById('search-btn');
const searchbox = document.getElementById('search');

/**
 * 데이터를 화면에 표시하는 함수
 * @param {Object} datas 화면에 표시할 데이터 객체
 */
async function displayData(datas) {
    const container = document.getElementById('data-container');
    container.innerHTML = ''; // 이전 데이터를 지웁니다.

    if (datas && Array.isArray(datas)) {
        datas.forEach(item => {
            let rank = '';
            if(item.rank == '매우우수'){
                rank = `<div class="star"><h3>위생등급: 매우우수<img src="./css/images/3star.svg" class="3star"></h3></div>`;
            } else if(item.rank == '우수'){
                rank = `<div class="star"><h3>위생등급: 우수<img src="./css/images/2star.svg" class="2star"></h3></div>`;
            } else if(item.rank == '좋음'){
                rank = `<div class="star"><h3>위생등급: 좋음<img src="./css/images/1star.svg" class="1star"></h3></div>`;
            }

            if (!item.detail){
                item.detail = '';
            } else {
                item.detail = `위반내용: ` + item.detail;
            }
            if (!item.no){
                item.no = '';
            } else {
                item.no = `지정번호: ` + item.no;
            }
            if (!item.penalty){
                item.penalty = '';
            } else {
                item.penalty = `처벌내용: ` + item.penalty;
            }
            if (!item.category){
                item.category = '';
            } else {
                item.category = `업종명: ` + item.category;
            }

            // 전화번호 처리
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
                }
            }

            const itemElement = document.createElement('div');
            itemElement.classList.add('content');
            if (item.detail) {
                itemElement.classList.add('violation');
            }
            let itemHTML = '<div class="content-info">';
            itemHTML += `<h2>${item.name}`;

            if (item.detail) {
                itemHTML += ` <img src="./css/images/violation_icon.png" alt="위반" class="violation-icon">`;
            } else if (!item.detail && !item.rank) {
                itemHTML += ` <span class="exemplary-text"><img src="./css/images/exemplary_icon.png" alt="모범음식점" class="exemplary-icon"> 모범음식점</span>`;
            }

            itemHTML += `</h2>`;
            itemHTML += rank; // 위생등급
            itemHTML += `<p>${item.detail || ''}</p><br>`;                                                    
            itemHTML += `<p>지정일자: ${item.date || ''}</p><br>`; // 지정일자
            itemHTML += `<p>${item.addr || ''}</p><br>`; // 주소
            if (tel) {
                itemHTML += `<p>전화번호: ${tel}</p><br>`; // 전화번호
            }
            itemElement.innerHTML = itemHTML;
            container.appendChild(itemElement);
        });
    } else {
        console.error('데이터가 없습니다.');
    }
}

// 페이지 로드 시 sessionStorage에서 검색 결과 복원
document.addEventListener('DOMContentLoaded', function() {
    const savedResults = sessionStorage.getItem('searchResults');
    if (savedResults) {
        const results = JSON.parse(savedResults);
        displayData(results);
    }
});

async function search() {
    scrollToTop();
    const keyword = searchbox.value;
    const checkboxes = document.querySelectorAll('.search-check:checked');
    const rank = document.querySelectorAll('.rank:checked');
    const ubtype = document.querySelectorAll('.ubtype:checked');
    const collection = [];
    checkboxes.forEach(checkbox => {
        collection.push(checkbox.value);
    });
    if (collection.length >= 2) {
        console.error('위생등급은 하나만 선택하세요.');
        alert('위생등급은 하나만 선택하세요.');
        return;
    }
    if (!keyword) {
        console.error('검색어를 입력하세요.');
        alert('검색어를 입력하세요.');
        return;
    }
    let types = [];
    let rans = [];
    rank.forEach(rank => {
        rans.push(rank.value);
    });
    ubtype.forEach(type => {
        types.push(type.value);
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
    if (types.length > 0) {
        if (types.length > 0) {
            if (types.includes('음식점')) {
                // '음식점'이 types 배열 안에 포함되어 있는 경우
                query.$and.push({ type: { $not: { $regex: '급식',$options: 'i' } }, 
                category: { $not: { $regex: '급식',$options: 'i' } } });  
            } else if (types.includes('급식')) {
                // '급식'이 types 배열 안에 포함되어 있는 경우
                query.$and.push({ 
                    $or: [
                        { type: { $regex: '급식', $options: 'i' } },
                        { category: { $regex: '급식', $options: 'i' } }
                    ]
                });
            }
        }
    } else if (types.length >= 2){
        return alert('분류를 하나만 선택해주세요');
    };
    console.log(query, collection);
    try {
        const queryString = encodeURIComponent(JSON.stringify(query));
        const response = await fetch(`/main/search?collection=${collection}&query=${queryString}`);
        if (!response.ok) {
            throw new Error('서버 응답에 문제가 발생했습니다.');
        }

        const data = await response.json();
        console.log(data);
        displayData(data);
    } catch (error) {
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
