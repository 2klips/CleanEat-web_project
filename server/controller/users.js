const database = require('../database/database.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config.js');


const secretKey = config.jwt.secretKey;
const jwtExpiresInDays = config.jwt.expiresInSec;
const bcryptSaltRounds = config.bcrypt.saltRounds;

function createJwtToken(id){
    return jwt.sign({id}, secretKey, {expiresIn: jwtExpiresInDays});
}




async function signup(req, res, next){
    const {id, password, name, email} = req.body;
    const found = await database.findById(id);
    if(found){
        return res.status(409).json({message:`${id}이 이미 있습니다`});
    }
    const hashed = await bcrypt.hash(password, bcryptSaltRounds);
    const userId = await database.createUser({id, hashed, name, email});
    const token = createJwtToken(id);
    res.status(201).json({token, id});
}


async function login(req, res, next){
    const {userid, password} = req.body;
    const user = await database.findById(userid);
    if(!user){
        return res.status(401).json({message: `아이디를 찾을 수 없음`});
    }
    const isValidpassword = bcrypt.compareSync(password, user.password);
    if(!isValidpassword){
        return res.status(401).json({message: `비밀번호가 틀렸음`});
    }
    const token = createJwtToken(userid);
    res.status(200).json({token, userid});
}



async function me(req, res, next){
    const user = await database.findById(req.userId);
    if(!user){
        return res.status(404).json({message: `일치하는 사용자가 없음`});
    }
    res.status(200).json({token: req.token, userId: user.id});
}

module.exports = {signup, login, me};