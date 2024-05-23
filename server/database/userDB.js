const Mongoose = require('mongoose');
const { useVirtualId } = require('./database.js');

const userSchema = new Mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    hp: {type: String, required: true},
    addr1: {type: String, required: true},
    addr2: {type: String, required: true},
    image: {type: String, default: ''},
    deviceToken: {type: String, default: ''},
});

useVirtualId(userSchema);

const User = Mongoose.model('User', userSchema);


async function findAll(){
    return User.find();
}

// 이메일 중복검사
async function findByEmail(email){
    return User.findOne({email});
}

async function findById(id){
    return User.findById(id);
}


async function createUser(user){
    return new User(user).save().then(data => data.id);
}

async function setDeviceToken(email, deviceToken){
    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { deviceToken: deviceToken },
            { new: true, useFindAndModify: false }
        );
        if (!user) {
            throw new Error('해당 이메일의 사용자를 찾을 수 없습니다.');
        }
        return user;
    } catch (error) {
        console.error('장치 토큰 업데이트 중 오류 발생:', error);
        throw error;
    }
}

module.exports = {findByEmail, createUser, findById, setDeviceToken, findAll};