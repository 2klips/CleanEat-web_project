const jwt = require('jsonwebtoken');
const database = require('../database/database');


const AUTH_ERROR = {message: "인증에러"};


const isAuth = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    console.log(authHeader);
    if(!(authHeader && authHeader.startsWith('Bearer '))){
        console.log('에러1');
        return res.status(401).json(AUTH_ERROR);
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token, 'abcd1234%^&*', async(error, decoded) => {
            if(error){
                console.log('에러2');
                return res.status(401).json(AUTH_ERROR);
            }
            const user = await database.findById(decoded.id);
            if(!user){
                console.log('에러3');
                return res.status(401).json(AUTH_ERROR);
            }
            req.userId = user.id;
            next();
        }
    );
}

module.exports = isAuth;