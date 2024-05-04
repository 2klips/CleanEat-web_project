const { MongoClient } = require('mongodb');
const config = require('../config.js');

// MongoDB 서버 URI
const uri =config.db.URI;

// MongoDB 데이터베이스 이름
const client = new MongoClient(uri);

// MongoDB 클라이언트 생성
const dbName = config.db.DB_NAME;

const datas = [];
/**
 * 데이터베이스 연결합니다.
 * @returns {Promise} MongoDB 데이터베이스 연결 객체
 */
async function connectMongoDB() {
    try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    return db;
    // 이후 작업을 수행할 수 있습니다.
    } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    }
}

/** @module database
 * 데이터베이스에서 검색.
 * @param {string} collecTion - 검색할 컬렉션 이름
 * @param {string} keyWord - 검색할 키워드
 * @returns {Array} 검색 결과 배열
 */
async function searchDB(collecTion,keyWord) {
    try {
        await connectMongoDB();
        const db = await client.db(dbName);
        const result = await db.collection(collecTion).find({ $text: { $search: keyWord} }).toArray();
        console.log('검색완료')
        return result;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}

async function searchAllDB(keyWord) {
    try {
        await connectMongoDB();
        const db = await client.db(dbName);
        const result1 = await db.collection("safetyRankData").find({ $text: { $search: keyWord} }).toArray();
        const result2 = await db.collection("ExemplaryRestaurantData").find({ $text: { $search: keyWord} }).toArray();
        const result3 = await db.collection("violationData").find({ $text: { $search: keyWord} }).toArray();
        console.log('검색완료')
        await datas.push(result1,result2,result3);
        console.log(datas);
        return datas;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }

}

/**
 * 데이터를 컬렉션에 삽입
 * .
 * @param {Array} data - 삽입할 데이터 배열
 * @param {string} collecTion - 데이터를 삽입할 컬렉션 이름
 */
async function insertData(data, collecTion) {
    try {
        await connectMongoDB();
        const db = client.db(dbName);
        const coll = db.collection(collecTion);
        const result = await coll.insertMany(data);
        console.log("Inserted data:", result.insertedCount);
    } catch (error) {
        console.error("Failed to insert data", error);
    } finally {
        client.close();
    }
}

searchAllDB('강남구');
module.exports = {
    connectMongoDB,
    searchDB,
    insertData,
    searchAllDB
};