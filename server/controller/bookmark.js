const userDB = require('../database/userDB.js');
const bookmarkDB = require('../database/bookmarkDB.js');
const { token } = require('morgan');
const db = require('../database/database.js');

async function insertBookmark(req, res, next){
    const id = req.body.id;
    const bookmark = await db.searchBy_id(id);
    bookmark.userEmail = req.user.email;
    bookmark.dataId = id;
    try {
        const bookmarkId = await bookmarkDB.insertBookmark(bookmark);
        res.status(201).send({ message: 'Bookmark added', bookmarkId});
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Failed to add bookmark' });
    }

}

async function getBookmarks(req, res, next){
    const token = req.token;
    const userEmail = req.user.email;
    try {
        const bookmarks = await bookmarkDB.getBookmarks(userEmail);
        if(bookmarks){
            res.status(201).json({bookmarks: bookmarks});
        }else{
            res.status(404).send({ error: 'Bookmarks not found' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Failed to fetch bookmarks' });
    }
}

async function deleteBookmark(req, res, next){
    console.log(req.body)
    const userEmail = req.user.email;
    const {dataId} = req.body;
    try {
        await bookmarkDB.deleteBookmark(userEmail, dataId);
        res.status(200).send({ message: 'Bookmark deleted' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete bookmark' });
    }
}




module.exports = {insertBookmark, getBookmarks, deleteBookmark};