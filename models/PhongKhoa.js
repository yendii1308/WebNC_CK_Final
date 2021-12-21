const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PhongKhoaSchema = new Schema({
    idphongkhoa: Number,
    name: String
})

module.exports = mongoose.model('PhongKhoa', PhongKhoaSchema)