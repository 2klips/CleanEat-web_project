const mongoose = require('mongoose');
const express = require('express');

const userSchema = new mongoose.Schema({
    nickname: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    hp: {type: String, required: true},
    addr1: {type: String, required: true},
    addr2: {type: String, required: true},
});

const User = mongoose.model('User', userSchema);

export default User;