const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ThongBaoSchema = new Schema({
    idphongkhoa: Number,
    namekhoa: String,
    title: String,
    content: String,
    time: String
})

module.exports = mongoose.model('ThongBao', ThongBaoSchema)