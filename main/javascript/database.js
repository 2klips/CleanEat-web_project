const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // MongoDB 서버 URI
const dbName = 'projectDB'; // 연결할 데이터베이스 이름

const client = new MongoClient(uri);

export async function connectMongoDB() {
    try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    // 이후 작업을 수행할 수 있습니다.
    } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    }
}

connectMongoDB();