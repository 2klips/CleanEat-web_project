const Mongoose = require('mongoose');


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

async function getDeviceToken() {
    try {
        // deviceToken 필드가 비어있지 않은 항목만 반환하고, deviceToken 필드만 포함
        const tokens = await User.find({ deviceToken: { $ne: '' } }, { deviceToken: 1, _id: 0 });
        // deviceToken 필드만 추출하여 배열로 반환
        const validTokens = tokens.filter(item => item !== '').map(tokenObj => tokenObj.deviceToken);;
        return validTokens;
    } catch (error) {
      console.error('Error fetching device tokens:', error);
      throw error;
    }
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

async function deleteDeviceToken(email){
    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { deviceToken: '' },
            { new: true, useFindAndModify: false }
        );
        if (!user) {
            throw new Error('해당 이메일의 사용자를 찾을 수 없습니다.');
        }
        return user;
    } catch (error) {
        console.error('장치 토큰 삭제 중 오류 발생:', error);
        throw error;
    }
}

module.exports = {findByEmail, createUser, findById, setDeviceToken, findAll, deleteDeviceToken, getDeviceToken};