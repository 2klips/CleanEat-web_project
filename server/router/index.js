const express = require('express');
const mainRouter = require('./main.js');
const userRouter = require('./users.js');

const router = express.Router();


router.use('/main', mainRouter);
router.use('/me', userRouter);

module.exports = router;