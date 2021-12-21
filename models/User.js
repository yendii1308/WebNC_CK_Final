const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: String,
    email: String,
    username: String, 
    pass: String,
    khoa: String,
    idkhoa: Array,
    lop: String,
    chucvu: String,
    avt: String,
})

module.exports = mongoose.model('User', UserSchema)