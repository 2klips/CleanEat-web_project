const { MongoClient } = require('mongodb');
const config = require('../config');


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
        const db = await connectMongoDB();
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
    } finally {
        client.close();
    }
}




// 아이디 중복검사
async function findById(userid){
    await connectMongoDB();
    const db = await client.db(dbName);
    const users = await db.collection('users')
    return users.find({"userid": userid});
}



/**
    로그인
    @param {string} userid
*/
async function login(userid){
    await connectMongoDB();
    const db = await client.db(dbName);
    const users = await db.collection('users')
    const user = users.find({"userid": userid})
    return user;
}

/**
 * 회원가입
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


module.exports = { 
    connectMongoDB,
    searchDB,
    insertData,
    findById,
    login,
    createUser,
    disconnectMongoDB
};
