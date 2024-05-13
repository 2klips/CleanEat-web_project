const Mongoose = require('mongoose');
const { useVirtualId } = require('./database.js');

const userSchema = new Mongoose.Schema({
    nickname: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    hp: {type: String, required: true},
    addr1: {type: String, required: true},
    addr2: {type: String, required: true},
});

useVirtualId(userSchema);

const User = Mongoose.model('User', userSchema);



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

module.exports = {findByEmail, createUser, findById};