const express = require('express');
const router = express.Router();
const path = require('path');
const { body } = require('express-validator');
const userController = require('../controller/users.js');
const {validate} = require('../middleware/validator.js');
const { isAuth } = require('../middleware/middleware.js');


const validateLogin = [
    body('username').trim().notEmpty().withMessage('username을 입력해주세요'),
    body('password').trim().isLength({min:4}).withMessage('password는 최소 4자 이상 입력해주세요'),
    validate
]

const validateSignup = [
    ...validateLogin,
    body('name').trim().notEmpty().withMessage('name을 입력하세요'),
    body('email').trim().isEmail().withMessage('이메일 형식 확인하세요'),
    validate
]

// router.post('/signup', validateSignup, userController.signup);

// router.post('/login', userController.login);

// router.get('/', isAuth, userController.me)

module.exports = router;