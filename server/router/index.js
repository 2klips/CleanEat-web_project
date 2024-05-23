const express = require('express');
const mainRouter = require('./main.js');
const userRouter = require('./users.js');
const adminRouter = require('./admin.js')

const router = express.Router();


router.use('/main', mainRouter);
router.use('/me', userRouter);
router.use('/info', userRouter);
router.use('/admin', adminRouter);


module.exports = router;