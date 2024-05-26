const jwt = require('jsonwebtoken');
const database = require('../database/database');
const userDB = require('../database/userDB');


const AUTH_ERROR = {message: "인증에러"};


const isAuth = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!(authHeader && authHeader.startsWith('Bearer '))){
        console.log('로그인이 필요합니다');
        return res.redirect('me/login');;
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token, 'abcd1234%^&*', async(error, decoded) => {
            if(error){
                console.log('에러2');
                console.log(error)
                return res.status(401).json(AUTH_ERROR);
            }
            const user = await userDB.findById(decoded.id);
            if(!user){
                console.log('에러3');
                return res.status(401).json(AUTH_ERROR);
            }
            req.token = token;
            req.user = user;
            next();
        }
    );
}


module.exports = {isAuth};