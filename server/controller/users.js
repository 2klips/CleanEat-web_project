const database = require('../database/database.js');
const config = require('../config.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDB = require('../database/userDB.js');
const firebase_admin = require('../firebase_message.js');

function createJwtToken(id){
    return jwt.sign({id}, config.jwt.secretKey, {expiresIn: config.jwt.expiresInSec});
}

async function findByEmail(req, res, next) {
    const email = req.query.email;
    try {
        const found = await userDB.findByEmail(email);
        if (found) {
            return res.status(409).json({ message: `${email}이 이미 있습니다` });
        } else {
            return res.status(200).json({ message: '사용 가능한 이메일입니다' });
        }
    } catch (error) {
        next(error);
    }
}

async function signup(req, res, next){
    let {name, password, email, addr1, addr2, hp} = req.body;
    console.log(req.body);
    const found = await userDB.findByEmail(email);
    if(found){
        return res.status(409).json({message:`${email}이 이미 있습니다`});
    }
    password = await bcrypt.hash(password, config.bcrypt.saltRounds);
    const user = await userDB.createUser({name, password, email, addr1, addr2, hp});
    const token = createJwtToken(user.id);
    res.status(201).json({ message: 'Signup successful', redirectUrl: '/me/login' });
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
    const token = createJwtToken(user.id);
    res.status(200).json({token, name: user.name});
}


async function me(req, res, next){
    const token = req.token;
    const user = await userDB.findByEmail(req.user.email);
    if(!user){
        return res.status(404).json({message: `일치하는 사용자가 없음`});
    }
    // `/me/mypage?token=${req.token}`
    res.status(200).json({token, name: user.name});
}

async function setDeviceToken(req, res, next){
    const {deviceToken} = req.body;
    const user = req.user;
    const result = await userDB.setDeviceToken(user.email, deviceToken);
    firebase_admin.subscribeToTopic('all');
    res.status(200).json({message: 'Device token updated'});
}

async function deleteDeviceToken(req, res, next){
    const user = req.user;
    await userDB.deleteDeviceToken(user.email);
    res.status(200).json({message: 'Device token deleted'});
}


module.exports = {signup, login, me, setDeviceToken, deleteDeviceToken, findByEmail};