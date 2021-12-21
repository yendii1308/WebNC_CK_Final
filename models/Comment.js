const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    iduser: String,
    idpost: String,
    content: String,
    time: String
})

module.exports = mongoose.model('Comment', CommentSchema)