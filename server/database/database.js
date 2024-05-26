const { MongoClient, ObjectId } = require('mongodb');
const config = require('../config');
const mongoose = require('mongoose');

// MongoDB 서버 URI
const uri =config.db.URI;

// MongoDB 데이터베이스 이름
const client = new MongoClient(uri);

// MongoDB 클라이언트 생성
const dbName = config.db.DB_NAME;

let datas = [];
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
async function connectMongoose() {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: dbName});
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

/** @module database
 * 데이터베이스에서 검색.
 * @param {string} collecTion - 검색할 컬렉션 이름
 * @param {Object} query - MongoDB 쿼리 객체
 * @returns {Array} 검색 결과 배열
 */
async function searchDB(collecTion,query) {
    if(!collecTion){
        collecTion = "safetyRankData";
    }
    try {
        const db = client.db(dbName);
        const result = await db.collection(collecTion).find(query).toArray();
        if(result && result.length > 0){
            console.log('검색완료')
            return result;
        }else{
            console.log('검색결과 없음')
        }

    } catch (error) {
        console.error('Error:', error);
    } 
    // finally {
    //     client.close();
    // }
}


async function searchBy_id(id) {
    try {
        const db = client.db(dbName);
        const Collection1 = db.collection('ExemplaryRestaurantData');
        const Collection2 = db.collection('safetyRankData');
        const Collection3 = db.collection('violation');
        const objectId = new ObjectId(id);
        const collections = [Collection1, Collection2, Collection3];
        const results = await Promise.all(
            collections.map(async (collection) => {
                return await collection.findOne({ _id: objectId });
            })
        );
        const resultsWithoutId = {};
        results.forEach(result => {
            if (result) {
                const { _id, ...rest } = result;
                Object.assign(resultsWithoutId, rest);
            }
        });
        return resultsWithoutId;
    } catch (error) {
        console.error('Error searching by id:', error);
        throw error;
    }
}

async function disconnectMongoDB() {
    try {
        await client.close();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Failed to disconnect from MongoDB', error);
    }

};

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
    }
}





/** 회원가입
 * @param {Object} user 사용자 정보 객체
 * @param {string} user.username 사용자 아이디
 * @param {string} user.password 사용자 비밀번호
 * @param {string} user.name 사용자 이름
 * @param {string} user.email 사용자 이메일
 * @param {string} user.url 사용자 프로필 사진 URL
 * @returns {string} 생성된 사용자의 아이디
 */




/** 회원가입
 * @param {Object} user 사용자 정보 객체
 * @param {string} user.username 사용자 아이디
 * @param {string} user.password 사용자 비밀번호
 * @param {string} user.name 사용자 이름
 * @param {string} user.email 사용자 이메일
 * @param {string} user.url 사용자 프로필 사진 URL
 * @returns {string} 생성된 사용자의 아이디
 */
async function createUser(user){
    const created = {...user }
    insertData(users, created)
    return created.username;
}

// 필드 삭제
// const db = client.db(dbName);
// db.collection("ExemplaryRestaurantData").updateMany({}, { $unset: { "CGG_CODE": "", "ASGN_YY": "", "APPL_YMD": "", "SITE_ADDR": "", "PERM_NT_NO": "", "MAIN_EDF": "", "TRDP_AREA": "", "ADMDNG_NM": "", "GRADE_FACIL_GBN": "" } });
// 필드 수정
// const db = client.db(dbName);
// db.collection("ExemplaryRestaurantData").updateMany({}, { $rename: { } });


module.exports = { 
    connectMongoDB,
    searchDB,
    insertData,
    disconnectMongoDB,
    createUser,
    connectMongoose,
    searchBy_id
};
