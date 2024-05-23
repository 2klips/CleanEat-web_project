const express = require('express');
const router = express.Router();
const mainController = require('../controller/main.js');
const path = require('path');

router.use(express.static(path.join(__dirname, '../../public')));


router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname,'../../public/index.html'));
});

router.get('/index', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../../public/main/index.html'));
});

router.get('/list', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../../public/main/list.html'));
});


// /main/list/search?keyword=강남
router.get('/list/search', mainController.search);

router.get('/search', mainController.search);


module.exports = router;