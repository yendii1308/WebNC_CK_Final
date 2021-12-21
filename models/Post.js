const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    user: String,
    type: String, //port || youtube
    content: String,
    image: String,
    idyoutube: String,
    time: String
})

module.exports = mongoose.model('Post', PostSchema)