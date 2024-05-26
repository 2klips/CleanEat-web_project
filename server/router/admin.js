const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../../server/database/userDB.js');
const db_upso = require('../../server/database/database.js');
const firebase_message = require('../firebase_message.js');

const app = express();
app.use(express.json());

/* 어드민 페이지 http://localhost:8080/admin/ */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname,'../../public/admin_page/src/index.html'));
});

router.get('/upso', async function(req, res, next) {
    try{
    res.sendFile(path.join(__dirname,'../../public/admin_page/src/upso.html'))
    }
    catch(err){console.error(err)
        next(err);
    }
});

/* 어드민 페이지에서 사용할 유저 db 불러오기 */
router.get('/api/user', async (req, res) => {
        try {
          // 데이터베이스에서 사용자 데이터를 가져오기
          const users = await db.findAll();
          
          // 클라이언트에 사용자 데이터를 JSON 형식으로 반환
          res.json({ users: users});
        } catch (error) {
          // 오류가 발생할 경우 오류를 반환
          res.status(500).json({ message: error.message });
        }
      });


/* 어드민 페이지에서 사용할 업소 db 불러오기 */
router.get('/api/upso', async (req, res) => {
  try {
    // 데이터베이스에서 사용자 데이터를 가져오기
    const upso = await db_upso.searchDB();
    // 클라이언트에 사용자 데이터를 JSON 형식으로 반환
    res.json({upso: upso});
  } catch (error) {
    // 오류가 발생할 경우 오류를 반환
    res.status(500).json({ message: error.message });
  }
});

/* 위반 업소 db 불러오기 */
router.get('/api/violation', async (req, res) => {
  try {
    // 데이터베이스에서 사용자 데이터를 가져오기
    const upso = await db_upso.searchDB();
    const violation = await db_upso.searchDB('violation');
    // 클라이언트에 사용자 데이터를 JSON 형식으로 반환
    res.json({upso: upso , violation:violation});
  } catch (error) {
    // 오류가 발생할 경우 오류를 반환
    res.status(500).json({ message: error.message });
  }
});

/* 유저 페이지 제공  http://localhost:8080/admin/user */
router.get('/user', async function(req, res, next) {
    res.sendFile(path.join(__dirname,'../../public/admin_page/src/userinfo.html'));
    });

router.post('/send_message', firebase_message.send_message);


router.use(express.static(path.join(__dirname, '../../public/admin_page/src')));
app.use('/assets', express.static(path.join(__dirname, 'public/admin_page')));

module.exports = router;