const apiData = require('../../api/apidate.js');
const db = require('../../database/database.js');

const  apidatas = await apiData.apiData();


/**
 * 데이터를 화면에 표시하는 함수
 * @param {Object} datas 화면에 표시할 데이터 객체
 */
async function displayData(datas) {
    const container = document.getElementById('data-container');
    container.innerHTML = ''; // 이전 데이터를 지웁니다.

    if (datas) {
        // 데이터 객체에서 식당 정보 배열을 가져옵니다.;
        datas.forEach(item => {
            // 각 식당 정보를 화면에 출력합니다.
            const itemElement = document.createElement('div');
            let itemHTML = '<div class="content">';
            itemHTML += '<div class="content-info">';
            itemHTML += `<h2>${item.UPSO_NM}</h2>`; // 식당명
            itemHTML += `<p>${item.SNT_UPTAE_NM}</p>`; // 업태명
            itemHTML += `<div class="star"><h3>위생등급: ${HG_ASGN_LV}</h3></div>`; // 위생등급
            itemHTML += `<p>${item.SITE_ADDR_RD}</p><br>`; // 주소
            itemHTML += `<p>${item.UPSO_SITE_TELNO}</p><br>`; // 전화번호
            itemHTML += '</div>';
            itemElement.innerHTML = itemHTML;
            container.appendChild(itemElement);
        });
    } else {
        console.error('데이터가 없습니다.');
    }
}




/**
 * 키워드로 검색을 수행하는 함수
 * @param {string} keyword 검색어
 */
async function search(keyword) {
    if(!keyword) return alert('검색어를 입력해주세요.');
    scrollToTop();
    datas = db.searchDB(keyword);
    if(datas){
        displayData(datas);
    }else{
        alert('검색 결과가 없습니다.');
    }
}


window.onload = async function() {
    // 검색 버튼 클릭 시 실행되는 이벤트 리스너
    document.getElementById('search-btn').addEventListener('click', async function() {
        const searchBtn = document.getElementById('search-btn');
        if(searchBtn.disabled) {
            console.log("서버 통신 중");
            return;
        };
        searchBtn.disabled = true;
        const keyword = document.getElementById('search').value;
        await search(keyword);
        searchBtn.disabled = false;
    });

    // 검색어 입력 필드에서 Enter 키 입력 시 실행되는 이벤트 리스너
    document.getElementById('search').addEventListener('keypress', async function(event) {
        const searchBtn = document.getElementById('search');
        if (searchBtn.disabled) {
            console.log("서버 통신 중");
            return;
        };
        searchBtn.disabled = true;
        if (event.keyCode === 13) {
            const keyword = document.getElementById('search').value;
            await search(keyword);
        }
        searchBtn.disabled = false;
    });
};