const jwt = require('jsonwebtoken');
const userDB = require('../database/userDB.js');
const config = require('../config.js');

const AUTH_ERROR = {message: "인증에러"};


const isAuth = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        return res.sendFile(path.join(__dirname, '../public/login_regis/index.html'));
    }
    if(authHeader.startsWith('Bearer ')){
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
            const user = await userDB.findByEmail(decoded.email);
            if(!user){
                console.log('에러3');
                return res.status(401).json(AUTH_ERROR);
            }
            req.userEmail = user.email;
            next();
        }
    );
}

module.exports = {isAuth};