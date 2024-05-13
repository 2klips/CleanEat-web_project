const userDB = require('../database/userDB.js');
const config = require('../config.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function createJwtToken(id){
    return jwt.sign({id}, config.jwt.secretKey, {expiresIn: config.jwt.expiresInSec});
}


async function signup(req, res, next){
    let {name, password, email, addr1, addr2, hp, nickname} = req.body;
    const found = await userDB.findByEmail(email);
    if(found){
        return res.status(409).json({message:`${username}이 이미 있습니다`});
    }
    password = await bcrypt.hash(password, config.bcrypt.saltRounds);
    const userInfo = await userDB.createUser({name, password, email, addr1, addr2, hp, nickname});
    const token = createJwtToken(userInfo);
    res.status(201).json({token, nickname});
}


async function login(req, res, next){
    const {email, password} = req.body;
    // const user = await userDB.login(username);
    const user = await userDB.findByEmail(email);
    console.log(user);
    if(!user){
        return res.status(401).json({message: `아이디를 찾을 수 없음`});
    }
    const isValidpassword = await bcrypt.compareSync(password, user.password);
    if(!isValidpassword){
        return res.status(401).json({message: `비밀번호가 틀렸음`});
    }
    const token = createJwtToken(user.email);
    res.status(200).json({token, nickname});
}


async function me(req, res, next){
    const user = await userDB.findByEmail(email);
    if(!user){
        return res.status(404).json({message: `일치하는 사용자가 없음`});
    }
    res.status(200).json({token: req.token, nickname: user.nickname});
}



module.exports = {signup, login, me};