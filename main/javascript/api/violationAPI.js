const { MongoClient } = require('mongodb');
// const url = "mongodb://localhost:27017";
const url = "mongodb+srv://root:1234@song.jw12k5s.mongodb.net/";

const dbName = "projectDB";
const client = new MongoClient(url);

// const total = 289732
// const url = `http://openapi.seoul.go.kr:8088/70564c455773797334354d435a5050/json/SeoulAdminMesure/${startindex}/${endindex}/SNT_COB_NM=%EC%9D%8C%EC%8B%9D%EC%A0%90`
// const datas = {};
// async function fetchData(url) {
//     try {
//         let startindex = 1;
//         let endindex = 1000;
//         for(let i = 1; i < total; i+=1000){
//             const response = await fetch(url);
//             const data = await response.json();
//             startindex += 1000;
//             endindex += 1000;
//             console.log(data.SeoulAdminMesure.row);
//             datas.push(data.SeoulAdminMesure.row);
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return null;
//     }
// }

const baseUrl = 'http://openapi.seoul.go.kr:8088/70564c455773797334354d435a5050/json/SeoulAdminMesure/';
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
        // console.log(filteredData);
        // console.log(data.SeoulAdminMesure.row);
        // datas.push(...data.SeoulAdminMesure.row);
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



// async function insertData() {
//     try {
//     const violationCollection = client.db(projectDB).collection('violationData');
//     const result = await violationCollection.insertOne({ datas });
//     console.log('Inserted data:', result.insertedCount);
//     } catch (error) {
//     console.error('Failed to insert data', error);
//     }
// }



async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
}

async function insertData() {
    try {
        const db = client.db(dbName);
        const violationCollection = db.collection("violationData");
        const result = await violationCollection.insertMany(datas);
        console.log("Inserted data:", result.insertedCount);
    } catch (error) {
        console.error("Failed to insert data", error);
    } finally {
        client.close();
    }
}


fetchDataLoop()
    .then(connectToMongoDB)
    .then(insertData);
        
