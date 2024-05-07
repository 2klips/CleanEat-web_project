const db = require('../database/database.js');
const config = require('../config.js');


const apikey = config.api.SEOUL_API_KEY;



const baseUrl = `http://openapi.seoul.go.kr:8088/${apikey}/json/SeoulAdminMesure/`;
const itemsPerPage = 1000; // 한 페이지당 가져올 데이터 개수
let total = 0; // 가져올 전체 데이터의 개수
const datas = [];

async function fetchData(startindex) {
    try {
        const endindex = Math.min(startindex + itemsPerPage - 1, total);
        const url = `${baseUrl}${startindex}/${endindex}/`
        const response = await fetch(url);
        const data = await response.json();
        const filteredData = data.SeoulAdminMesure.row.filter(item => item.SNT_COB_NM.includes('음식점'));
        datas.push(...filteredData);

        return data.SeoulAdminMesure.list_total_count;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}

async function getTotal() {
    try {
        const url = `${baseUrl}1/2/`;
        const response = await fetch(url);
        const data = await response.json();
        total = data.SeoulAdminMesure.list_total_count;
    } catch (error) {
        console.error('Error fetching total count:', error);
    }
}

async function fetchDataLoop() {
    await getTotal();
    let startindex = 1;
    while (startindex <= total) {
        const newTotal = await fetchData(startindex);
        if (newTotal === 0) break; // 에러가 발생했거나 데이터를 가져오지 못한 경우 종료
        startindex += itemsPerPage;
    }
    console.log('Total data:', datas.length);
}



// fetchDataLoop()
//     .then(() => db.insertData(datas, 'violation'))
//     .catch(error => console.error('Error:', error));
// (async () => {
//     try {
//         await fetchDataLoop();
//         await db.insertData(datas, 'violation');
//     } catch (error) {
//         console.error('오류가 발생했습니다:', error);
//     }
// })();