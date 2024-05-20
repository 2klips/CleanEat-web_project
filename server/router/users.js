const express = require('express');
const {validate} = require('../middleware/validator.js');
const { isAuth } = require('../middleware/middleware.js');
const router = express.Router();
const path = require('path');
const userController = require('../controller/users.js');
const {body} = require('express-validator');

// router.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/info/main.html'));
// });






router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.get('/login' , (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/login_regist/index.html'));
});

// router.get('/', isAuth, userController.me);
router.get('/', (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        // return res.send('로그인이 필요합니다');
        return res.redirect('/me/login');
    }
    next();
}, isAuth, userController.me);

router.get('/mypage', isAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/info/main.html'));
});



router.use(express.static(path.join(__dirname, '../../public/login_regist')));
router.use(express.static(path.join(__dirname, '../../public/info')));

module.exports = router;