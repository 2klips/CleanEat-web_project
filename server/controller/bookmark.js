const userDB = require('../database/userDB.js');
const bookmarkDB = require('../database/bookmarkDB.js');


async function insertBookmark(req, res, next){
    const bookmark = req.body;
    bookmark.userEmail = req.user.email;
    try {
        const bookmarkId = await bookmarkDB.insertBookmark(bookmark);
        res.status(201).send({ id: bookmarkId });
    } catch (error) {
        res.status(500).send({ error: 'Failed to add bookmark' });
    }

}

async function getBookmarks(req, res, next){
    const userEmail = req.user.email;
    try {
        const bookmarks = await bookmarkDB.getBookmarks(userEmail);
        if(bookmarks){
            return res.status(200).send(bookmarks);
        }else{
            res.status(404).send({ error: 'Bookmarks not found' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Failed to fetch bookmarks' });
    }
}

async function deleteBookmark(req, res, next){
    const userEmail = req.user.email;
    const dataId = req.body.dataId;
    try {
        await bookmarkDB.deleteBookmark(userEmail, dataId);
        res.status(200).send({ message: 'Bookmark deleted' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete bookmark' });
    }
}




module.exports = {insertBookmark, getBookmarks, deleteBookmark};