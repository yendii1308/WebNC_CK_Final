const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LikeSchema = new Schema({
    idpost: String,
    iduser: String
})

module.exports = mongoose.model('Like', LikeSchema)