const express = require('express');
const { isAuth } = require('../middleware/middleware.js');
const router = express.Router();
const path = require('path');
const userController = require('../controller/users.js');


router.get('/findByEmail', userController.findByEmail);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/login' , (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/login_regist/index.html'));
});
// router.get('/', isAuth, userController.me);
router.get('/', isAuth, userController.me);

router.get('/mypage', isAuth, (req, res) => {
    const userData = {
        name: req.user.name,
        email: req.user.email,
        image: req.user.image,
        hp: req.user.hp,
        addr1: req.user.addr1,
        addr2: req.user.addr2,
        image: req.user.image,
        bookmark: req.user.bookmark,
    };
    res.json({ userData: userData });
});

router.put('/setDeviceToken', isAuth, userController.setDeviceToken);
router.delete('/deleteDeviceToken', isAuth, userController.deleteDeviceToken);



router.use(express.static(path.join(__dirname, '../../public/login_regist')));
router.use(express.static(path.join(__dirname, '../../public/info')));

module.exports = router;