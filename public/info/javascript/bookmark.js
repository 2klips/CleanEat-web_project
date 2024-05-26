window.onload = async function(){
    console.log('window.onload');
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('토큰이 없습니다.');
      return;
    }

    try {
      const response = await fetch('/info/bookmark', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('서버 응답 성공:', data);
        displayListData(data);
      } else {
        console.error('서버 응답 실패:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
    }
  }

// HTML 출력을 위한 함수

async function displayListData(datas) {
    const data = datas.bookmarks;
    console.log(data);
    const container = document.getElementById('inside_container');
    container.innerHTML = ''; // 이전 데이터를 지웁니다.

    if (data && Array.isArray(data)) {
        data.forEach(item => {
            let rank = '';
            if(item.rank === '매우우수'){
                rank = `<div class="star"><h3>위생등급: 매우우수<img src="../../main/css/images/3star.svg" class="3star"></h3></div>`;
            } else if(item.rank === '우수'){
                rank = `<div class="star"><h3>위생등급: 우수<img src="../../main//css/images/2star.svg" class="2star"></h3></div>`;
            } else if(item.rank === '좋음'){
                rank = `<div class="star"><h3>위생등급: 좋음<img src="../../main//css/images/1star.svg" class="1star"></h3></div>`;
            }

            if (!item.detail){
                item.detail = '';
            } else if(item.detail){
                item.detail = `<span class="violation">위반내용: ${item.detail}</span>`;
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

            const itemElement = document.createElement('div');
            itemElement.classList.add('content');
            if (item.detail) {
                itemElement.classList.add('violation');
            }
            let itemHTML = '<div class="content-info">';
            itemHTML += `<h2>${item.name}</h2>`;

            // const itemId = item._id;
            // // 로컬 스토리지에서 북마크 데이터  가져오기
            // const bookmarksObject = JSON.parse(localStorage.getItem('bookmark') || '{}');
            // // 객체를 배열로 변환
            // const bookmarksArray = Object.values(bookmarksObject);
            // const isBookmarked = bookmarksArray[0].find(bookmark => bookmark.dataId == itemId);
            // if (isBookmarked) {
            //     console.log('북마크됨');
            // }
            // // 체크된 상태인지 확인하여 HTML에 추가
            // itemHTML += `<input type="checkbox" class="bookmarkicon" name="bookmarkicon" ${isBookmarked ? 'checked' : ''}></input><p class="dataid" style="display:none">${itemId}</p>`;


            const itemId = item._id;
            // 로컬 스토리지에서 북마크 데이터  가져오기
            const bookmarksObject = JSON.parse(localStorage.getItem('bookmark') || '{}');
            // 객체를 배열로 변환
            const bookmarksArray = Object.values(bookmarksObject).flat();
            const isBookmarked = bookmarksArray.find(bookmark => bookmark.dataId == itemId);
            if (isBookmarked) {
                console.log('북마크됨');
            }
            // 체크된 상태인지 확인하여 HTML에 추가
            itemHTML += `<input type="checkbox" class="bookmarkicon" name="bookmarkicon" checked></input><p class="dataid" style="display:none">${itemId}</p>`;

            if (item.detail) {
                itemHTML += ` <img src="../../main//css/images/alert_circle_outline_icon_red.png" alt="위반" class="violation-icon">`;
            } else if (!item.detail && !item.rank) {
                itemHTML += ` <span class="exemplary-text"><img src="../../main//css/images/Logo.png" alt="모범음식점" class="exemplary-icon"> 클린잇 - 모범음식점</span>`;
            }

            itemHTML += rank; // 위생등급
            itemHTML += `<p>${item.detail || ''}</p><br>`;                               
            itemHTML += `<p class="address">${item.addr || ''}</p><br>`; // 주소
            if (tel) {
                itemHTML += `<p class="tel">전화번호: ${tel}</p><br>`; // 전화번호
            }
            itemElement.innerHTML = itemHTML;
            container.appendChild(itemElement);
        }
    );
}
}

// 북마크 아이콘 클릭 시 북마크 삭제
document.addEventListener('click', async function(event) {
    if (event.target.classList.contains('bookmarkicon')) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('토큰이 없습니다.');
            return;
        }

        const bookmarkElement = event.target.closest('.content-info'); // 부모 요소 중 가장 가까운 북마크 요소 찾기
        const dataid = bookmarkElement.querySelector('.dataid').textContent; // 북마크 요소에서 dataId 가져오기
        try {
            const response = await fetch(`/info/bookmark`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({dataId:dataid})
            });

            if (response.ok) {
                console.log('북마크 삭제 성공');
                bookmarkElement.remove(); // 북마크 요소 삭제
            } else {
                console.error('북마크 삭제 실패:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('요청 중 오류 발생:', error);
        }
    }
});