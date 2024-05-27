$(document).ready(function () {
    console.log('데이터를 불러옵니다.');
    let DBData_u = []; // 전체 DB 데이터
    let APIData_u = []; // 전체 API 데이터

    async function compareData(dbData, apiData) {
        // 결과가 다른 항목을 저장할 배열
        let differentResults = [];
    
        // DB 데이터를 기준으로 비교
        dbData.forEach(dbItem => {
            let matchItem = apiData.find(apiItem => apiItem.BSSH_NM === dbItem.name || apiItem.ADDR === dbItem.addr || apiItem.HG_ASGN_NO === dbItem.no);
            if (matchItem) {
                if (dbItem.rank !== matchItem.HG_ASGN_LV) {
                    differentResults.push({
                        name: dbItem.name, // 이름 대신 BSSH_NM 사용
                        addr: dbItem.addr, // 주소 대신 ADDR 사용
                        no: dbItem.no, // 번호 대신 HG_ASGN_NO 사용
                        dbRank: dbItem.rank,
                        apiRank: matchItem.HG_ASGN_LV,
                        isSame: false
                    });
                }
            } else {
                differentResults.push({
                    name: dbItem.name, // 이름 대신 BSSH_NM 사용
                    addr: dbItem.addr, // 주소 대신 ADDR 사용
                    no: dbItem.no, // 번호 대신 HG_ASGN_NO 사용
                    dbRank: dbItem.rank,
                    apiRank: null,
                    isSame: false
                });
            }
        });
    
        // 결과를 콘솔에 출력
        console.log('Different Results:', differentResults);
    
        // 다른 데이터가 있을 경우 메시지 표시
        if (differentResults.length > 0) {
            const response = await fetch('/admin/send_update_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: '클린잇 데이터 업데이트 알림',
                    body: `${differentResults.length}개의 새로운 데이터가 업데이트 되었습니다.`,
                    icon: '/public/admin_page/src/icon/logo_name.png'
                })
            })
            if(response.status === 200) {
                const data = await response.json();
                console.log(data.message);
            } else {
                console.error('알림 전송 실패');
            }
            displayDifferentDataMessage(differentResults.length);
        }
    }
    

    // 다른 데이터 메시지 표시 함수
    function displayDifferentDataMessage(differentDataCount) {
        let dropdownMenu = $(".dropdown-menu");
        dropdownMenu.empty();

        let messageItem =`
        <a class="dropdown-item preview-item">
                    <div class="preview-thumbnail">
                        <div class="preview-icon bg-danger">
                            <i class="mdi mdi-alert mx-0"></i>
                        </div>
                    </div>
                    <div class="preview-item-content">
                        <h6 class="preview-subject font-weight-normal">데이터 차이</h6>
                        <p class="font-weight-light small-text mb-0 text-muted">API와 DB간의 데이터 차이가 총 ${differentDataCount}개 있습니다. 자세한 내용은 콘솔을 확인해주세요.</p>
                    </div>
                </a>
            `;
        dropdownMenu.append(messageItem);
    }

    // DB 데이터 불러오기
    $.ajax({
        url: '/admin/api/upso', // 서버에서 사용자 데이터를 가져올 엔드포인트
        method: 'GET',
        success: function (data) {
            DBData_u = data.upso;
            console.log('DBData_u는 다음과 같습니다.:', DBData_u);

            // API 데이터 불러오기
            $.ajax({
                url: '/admin/api/upsoapi/rank', // 서버에서 사용자 데이터를 가져올 엔드포인트
                method: 'GET',
                success: function (data) {
                    APIData_u = data.upso;
                    console.log('APIData_u는 다음과 같습니다.:', APIData_u);

                    // 데이터를 비교하는 함수 호출
                    compareData(DBData_u, APIData_u);
                },
                error: function (err) {
                    console.error('Error fetching API data:', err);
                }
            });
        },
        error: function (err) {
            console.error('Error fetching DB data:', err);
        }
    });
});
