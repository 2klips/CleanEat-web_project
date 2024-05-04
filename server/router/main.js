var express = require('express');
var router = express.Router();
const app = express();




/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

router.get('/main/index.html', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/main/index.html'));
});

module.exports = router;