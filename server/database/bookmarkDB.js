const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    userEmail: {type: String, required: true},
    dataId: {type: String, required: true},
    name: {type: String},
    addr: {type: String},
    date: {type: String},
    rank: {type: String},
    no: {type: String},
    tel: {type: String},
    type: {type: String},
    category: {type: String},
    detail: {type: String},
    penalty: {type: String},
});

const Bookmark = mongoose.model('bookmark', BookmarkSchema);

async function insertBookmark(bookmark){
    return new Bookmark(bookmark).save().then(data => data.id);
}

async function getBookmarks(userEmail){
    return Bookmark.find({userEmail});
}

async function deleteBookmark(userEmail, dataId){
    return Bookmark.deleteOne({userEmail, dataId});
}

module.exports = {insertBookmark, getBookmarks, deleteBookmark};