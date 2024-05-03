// const url = `http://openapi.foodsafetykorea.go.kr/api/3e9e3054028b4ee58ad5/C004/json/${startindex}/${endindex}/ADDR=서울`

const itemsPerPage = 1000; // 한 페이지당 가져올 데이터 개수
let total = 5952; // 가져올 전체 데이터의 개수
const datas = [];
let startindex = 1;
let endindex = 1000;
async function fetchData(startIndex) {
    try {
        const startindex = startIndex;
        const endindex = Math.min(startindex + itemsPerPage - 1, total);
        const url = `http://openapi.foodsafetykorea.go.kr/api/3e9e3054028b4ee58ad5/C004/json/${startindex}/${endindex}/ADDR=서울`;
        const response = await fetch(url);
        const data = await response.json();
        // console.log(data.C004.row);
        datas.push(...data.C004.row);
        return data.C004.total_count;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}



async function fetchDataLoop() {
    startindex = 1;
    while (startindex <= total) {
        const newTotal = await fetchData(startindex);
        if (newTotal === 0) break; // 에러가 발생했거나 데이터를 가져오지 못한 경우 종료
        startindex += itemsPerPage;
    }
    console.log(datas);
}

fetchDataLoop();
// console.log(datas);