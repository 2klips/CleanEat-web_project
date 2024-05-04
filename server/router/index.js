const express = require('express');
const router = express.Router();

const main = require('./main.js');
const user = require('./users.js')

router.use('/', main);
router.use('/user', user);

module.exports = router;