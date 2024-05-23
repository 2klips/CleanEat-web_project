const express = require('express');
const { isAuth } = require('../middleware/middleware.js');
const router = express.Router();
const path = require('path');
const bookmarkController = require('../controller/bookmark.js');

router.post('/bookmark', isAuth, bookmarkController.insertBookmark);
router.get('/bookmark', isAuth, bookmarkController.getBookmarks);
router.delete('/bookmark', isAuth, bookmarkController.deleteBookmark);

router.use(express.static(path.join(__dirname, '../../public/login_regist')));
router.use(express.static(path.join(__dirname, '../../public/info')));


module.exports = router;