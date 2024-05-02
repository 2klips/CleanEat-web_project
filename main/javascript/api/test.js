const apiKey = '70564c455773797334354d435a5050';
const startIndex = 1;
const endIndex = 1;

let apiurl = {
    // 강북구 모범음식점 (지정현황) 조회
    gangbuk: `http://openAPI.gangbuk.go.kr:8088/${apiKey}/json/GbModelRestaurantDesignate/${startIndex}/${endIndex}/`,
    // 도봉구 모범음식점 (지정현황) 조회
    dobong: `http://openAPI.dobong.go.kr:8088/${apiKey}/json/DobongModelRestaurantDesignate/${startIndex}/${endIndex}/`,
};

let datas = {};
let totaldata = 0;

async function fetchData(apiurl, apiKey, startIndex, endIndex) {
    const url = apiurl;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};
for(key in apiurl){
    fetchData(apiurl[key], apiKey, startIndex, endIndex)
    .then(data => {
        for(key in data){
            // console.log(data[key]);
            if(data[key] == "list_total_count"){
                console.log(data[key]);
            }
        };
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

