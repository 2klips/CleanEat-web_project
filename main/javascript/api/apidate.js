const apikey = '70564c455773797334354d435a5050';
const startindex = 1;
const endindex = 1000;
// let datas = [];
let totaldata = 0;

let apiurl = [
    // 강북구 모범음식점 (지정현황) 조회
    "http://openapi.gangbuk.go.kr:8088/70564c455773797334354d435a5050/json/GbModelRestaurantDesignate/1/1000/",

    // 도봉구 모범음식점 (지정현황) 조회
    `http://openAPI.dobong.go.kr:8088/${apikey}/json/DobongModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 용산구 모범음식점 (지정현황) 조회
    `http://openAPI.yongsan.go.kr:8088/${apikey}/json/YsModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 성동구 모범음식점 (지정현황) 
    `http://openAPI.sd.go.kr:8088/${apikey}/json/SdModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 성북구 모범음식점 (지정현황) 
    `http://openAPI.sb.go.kr:8088/${apikey}/json/SbModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 광진구 모범음식점 (지정현황) 조회
    `http://openAPI.gwangjin.go.kr:8088/${apikey}/json/GwangjinModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 마포구 모범음식점 (지정현황) 조회
    `http://openAPI.mapo.go.kr:8088/${apikey}/json/MpModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 은평구 모범음식점 (지정현황) 조회
    `http://openAPI.ep.go.kr:8088/${apikey}/json/EpModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 중랑구 모범음식점 (지정현황) 조회
    `http://openAPI.jungnang.seoul.kr:8088/${apikey}/json/JungnangModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 강동구 모범음식점 (지정현황) 조회
    `http://openAPI.gd.go.kr:8088/${apikey}/json/GdModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 관악구 모범음식점 (지정현황) 조회
    `http://openAPI.gwanak.go.kr:8088/${apikey}/json/GaModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 서초구 모범음식점 (지정현황) 조회
    `http://openAPI.seocho.go.kr:8088/${apikey}/json/ScModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 종로구 모범음식점 (지정현황) 조회
    `http://openAPI.jongno.go.kr:8088/${apikey}/json/JongnoModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 양천구 모범음식점 (지정현황) 조회
    `http://openAPI.yangcheon.go.kr:8088/${apikey}/json/YcModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 구로구 모범음식점 (지정현황) 조회
    `http://openAPI.guro.go.kr:8088/${apikey}/json/GuroModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 동대문구 모범음식점 (지정현황) 조회
    `http://openAPI.ddm.go.kr:8088/${apikey}/json/DongdeamoonModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 동작구 모범음식점 (지정현황) 조회
    `http://openAPI.dongjak.go.kr:8088/${apikey}/json/DjModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 중구 모범음식점 (지정현황) 조회
    `http://openAPI.junggu.seoul.kr:8088/${apikey}/json/JungguModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 노원구 모범음식점 (지정현황) 조회
    `http://openAPI.nowon.go.kr:8088/${apikey}/json/NwModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 금천구 모범음식점 (지정현황) 조회
    `http://openAPI.geumcheon.go.kr:8088/${apikey}/json/GeumcheonModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 영등포구 모범음식점 (지정현황) 조회
    `http://openAPI.ydp.go.kr:8088/${apikey}/json/YdpModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 서대문구 모범음식점 (지정현황) 조회
    `http://openAPI.sdm.go.kr:8088/${apikey}/json/SeodaemunModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 강남구 모범음식점 (지정현황) 조회
    `http://openAPI.gangnam.go.kr:8088/${apikey}/json/GnModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 강서구 모범음식점 (지정현황) 조회
    `http://openAPI.gangseo.seoul.kr:8088/${apikey}/json/GangseoModelRestaurantDesignate/${startindex}/${endindex}/`,

    // 송파구 모범음식점 (지정현황) 조회
    `http://openAPI.songpa.seoul.kr:8088/${apikey}/json/SpModelRestaurantDesignate/${startindex}/${endindex}/`,
]

// 서울시 위생업소 전체 행정처분내역 현황
const violation =`http://openapi.seoul.go.kr:8088/${apikey}/json/SeoulAdminMesure/${startindex}/${endindex}/`

// 식품접객업소 위생등급 지정현황
const safetyRank = `http://openapi.foodsafetykorea.go.kr/api/3e9e3054028b4ee58ad5/C004/json/${startindex}/${endindex}/ADDR=서울`



// let requests = apiurl.map(url => fetch(url));
// console.log(requests) // [Promise, Promise]

// Promise.all은 모든 작업이 이행될 때까지 기다립니다.
// JSON 형태의 응답 메시지는 파싱 되어 배열 'users'에 저장됩니다.
// Promise.all(requests)
// .then(responses =>Promise.all(responses.map(r => r.json())))
//     .then(result => 
//         result.map((users)=>console.log(users)));


const requests = apiurl.map(url => fetch(url));


// Promise.all을 사용하여 모든 요청이 완료될 때까지 기다립니다.
Promise.all(requests)
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(usersData => {
        // 각 응답 데이터에서의 row 배열을 그대로 rowData 배열에 추가합니다.
        const rowData = usersData.map(item => {
            const key = Object.keys(item)[0];
            console.log(item[key].row);
            return item[key].row;
        });
        // console.log(rowData);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Promise.all을 사용하여 모든 요청이 완료될 때까지 기다립니다.
// Promise.all(requests)
//     .then(responses => Promise.all(responses.map(r => r.json())))
//     .then(usersData => {
//         // for(key in usersData){
//         //     console.log(usersData[key]);
//         // }
//         (async () => {
//             try {
//                 const apidata = usersData;
//                 const rowData = apidata.map(item => {
//                     const key = Object.keys(item)[0];
//                     const { row, ...rest } = item[key];
//                     return { ...row };
//                 });
//                 console.log(...rowData);
//             } catch (error) {
//                 console.error('Error:', error);
//             }
//         })();
//     // return usersData;
//     // usersData.forEach(users => console.log(users));
//     })
//     .catch(error => {
//     console.error('Error:', error);
// });

// (async () => {
//     try {
//         const apidata = usersData;
//         const rowData = apidata.map(item => {
//             const key = Object.keys(item)[0];
//             const { row, ...rest } = item[key];
//             return { ...row };
//         });
//         console.log(...rowData);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();