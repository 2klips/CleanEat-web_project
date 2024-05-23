const { Collection } = require('mongodb');
const database = require('../database/database.js');

async function search(req, res, next) {
    try {
        const collection = req.query.collection;
        const query = JSON.parse(req.query.query);
        console.log(query);
        const datas = await database.searchDB(collection, query);
        if (datas && datas.length > 0) {
            return res.json(datas);
        }else{
            return res.status(404).json({message: '데이터를 찾을 수 없습니다.'});
        }
    } catch (error) {
        console.error('데이터 검색 중 오류 발생:', error);
        return res.status(500).json({message: '서버 오류 발생'});
    }
}
module.exports = { search };