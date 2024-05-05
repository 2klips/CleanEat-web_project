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
        datas = datas.concat(result1, result2, result3);
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
    searchAllDB,
    findById,
    login,
    createUser
};

// (async () => {
//     try {
//         const db = await connectMongoDB();
//         await db.safetyRankData.updateMany({}, {$rename:{"HG_ASGN_LV":"rank","BSSH_NM":"name","ADDR":"addr","TELNO":"tel","HG_ASGN_YMD":"date","HG_ASGN_NO":"no"}});
//         console.log('성공적으로 수행되었습니다.');
//     } catch (error) {
//         console.error('오류가 발생했습니다:', error);
//     }
// })();


