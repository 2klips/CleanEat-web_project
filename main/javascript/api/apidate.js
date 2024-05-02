const apikey = '70564c455773797334354d435a5050';
const startindex = 1;
const endindex = 1000;
// let datas = [];
let totaldata = 0;

let apiurl = {
    // 강북구 모범음식점 (지정현황) 조회
    gangbuk:`http://openAPI.gangbuk.go.kr:8088/${apikey}/json/GbModelRestaurantDesignate/${startindex}/${endindex}/;`,

    // 도봉구 모범음식점 (지정현황) 조회
    dobong:`http://openAPI.dobong.go.kr:8088/${apikey}/json/DobongModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 용산구 모범음식점 (지정현황) 조회
    yongsan:`http://openAPI.yongsan.go.kr:8088/${apikey}/json/YsModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 성동구 모범음식점 (지정현황) 조회
    sd:`http://openAPI.sd.go.kr:8088/${apikey}/json/SdModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 성북구 모범음식점 (지정현황) 조회
    sb:`http://openAPI.sb.go.kr:8088/${apikey}/json/SbModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 광진구 모범음식점 (지정현황) 조회
    gwangjin:`http://openAPI.gwangjin.go.kr:8088/${apikey}/json/GwangjinModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 마포구 모범음식점 (지정현황) 조회
    mapo:`http://openAPI.mapo.go.kr:8088/${apikey}/json/MpModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 은평구 모범음식점 (지정현황) 조회
    ep:`http://openAPI.ep.go.kr:8088/${apikey}/json/EpModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 중랑구 모범음식점 (지정현황) 조회
    jungnang:`http://openAPI.jungnang.seoul.kr:8088/${apikey}/json/JungnangModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 강동구 모범음식점 (지정현황) 조회
    gd:`http://openAPI.gd.go.kr:8088/${apikey}/json/GdModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 관악구 모범음식점 (지정현황) 조회
    gwanak:`http://openAPI.gwanak.go.kr:8088/${apikey}/json/GaModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 서초구 모범음식점 (지정현황) 조회
    seocho:`http://openAPI.seocho.go.kr:8088/${apikey}/json/ScModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 종로구 모범음식점 (지정현황) 조회
    jongno:`http://openAPI.jongno.go.kr:8088/${apikey}/json/JongnoModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 양천구 모범음식점 (지정현황) 조회
    yangcheon:`http://openAPI.yangcheon.go.kr:8088/${apikey}/json/YcModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 구로구 모범음식점 (지정현황) 조회
    guro:`http://openAPI.guro.go.kr:8088/${apikey}/json/GuroModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 동대문구 모범음식점 (지정현황) 조회
    ddm:`http://openAPI.ddm.go.kr:8088/${apikey}/json/DongdeamoonModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 동작구 모범음식점 (지정현황) 조회
    dongjak:`http://openAPI.dongjak.go.kr:8088/${apikey}/json/DjModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 중구 모범음식점 (지정현황) 조회
    junggu:`http://openAPI.junggu.seoul.kr:8088/${apikey}/json/JungguModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 노원구 모범음식점 (지정현황) 조회
    nowon:`http://openAPI.nowon.go.kr:8088/${apikey}/json/NwModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 금천구 모범음식점 (지정현황) 조회
    geumcheon:`http://openAPI.geumcheon.go.kr:8088/${apikey}/json/GeumcheonModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 영등포구 모범음식점 (지정현황) 조회
    ydp:`http://openAPI.ydp.go.kr:8088/${apikey}/json/YdpModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 서대문구 모범음식점 (지정현황) 조회
    sdm:`http://openAPI.sdm.go.kr:8088/${apikey}/json/SeodaemunModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 강남구 모범음식점 (지정현황) 조회
    gangnam:`http://openAPI.gangnam.go.kr:8088/${apikey}/json/GnModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 강서구 모범음식점 (지정현황) 조회
    gangseo:`http://openAPI.gangseo.seoul.kr:8088/${apikey}/json/GangseoModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 송파구 모범음식점 (지정현황) 조회
    songpa:`http://openAPI.songpa.seoul.kr:8088/${apikey}/json/SpModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 서울시 위생업소 전체 행정처분내역 현황
    // violation:`http://openapi.seoul.go.kr:8088/${apikey}/json/SeoulAdminMesure/${startindex}/${endindex}/`,

    // // 식품접객업소 위생등급 지정현황
    // saferanked:`http://openapi.foodsafetykorea.go.kr/api/3e9e3054028b4ee58ad5/C004/json/${startindex}/${endindex}/ADDR=서울`,
}


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

async function getData() {
    let datas = [];
    try {
        for (const key in apiurl) {
            const data = await fetchData(apiurl[key], apikey, startindex, endindex);
            datas.push(data); // 각 API 호출 결과를 배열에 추가
        }
        return datas; // 모든 API 호출 결과를 포함한 배열 반환
    } catch (error) {
        console.error('Error:', error);
        throw error; // 에러가 발생하면 이를 상위로 전파
    }
}



// (async () => {
//     try {
//         const apidata = await getData();
//         const rowData = apidata.map(item => {
//             const key = Object.keys(item)[0];
//             return { [key]: item[key].row };
//         });
//         console.log(rowData);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();

(async () => {
    try {
        const apidata = await getData();
        const rowData = apidata.map(item => {
            const key = Object.keys(item)[0];
            const { row, ...rest } = item[key];
            return { ...row };
        });
        console.log(...rowData);
    } catch (error) {
        console.error('Error:', error);
    }
})();

