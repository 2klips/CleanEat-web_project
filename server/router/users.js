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
    res.json({ message: 'Authenticated' });
}, isAuth, userController.me);

router.get('/mypage', isAuth, (req, res) => {
    const user = req.user;
    res.json({ userData: user });
});



router.use(express.static(path.join(__dirname, '../../public/login_regist')));
router.use(express.static(path.join(__dirname, '../../public/info')));

module.exports = router;