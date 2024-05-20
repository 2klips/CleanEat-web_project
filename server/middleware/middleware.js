const jwt = require('jsonwebtoken');
const userDB = require('../database/userDB.js');
const config = require('../config.js');

const AUTH_ERROR = {message: "인증에러"};


const isAuth = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!(authHeader && authHeader.startsWith('Bearer '))){
        console.log('에러1');
        return res.status(401).json(AUTH_ERROR);
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token, config.jwt.secretKey, async(error, decoded) => {
            if(error){
                console.log('에러2');
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