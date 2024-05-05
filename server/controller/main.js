const { Collection } = require('mongodb');
const database = require('../database/database.js');

async function search(req, res, next) {
    const collection = req.query.collection;
    const keyword = req.query.keyword;
    const datas = await database.searchDB(collection,keyword);
    if(datas) {
        return res.json(datas);
    } else {
        res.status(404).json({message: '데이터가 없습니다.'});
    }
}

module.exports = { search };