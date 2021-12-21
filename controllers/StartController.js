const config = require("../config.json");
const md5 = require("md5");

const User = require('../models/User');
const PhongKhoa = require('../models/PhongKhoa');


module.exports.start = async (req, res) => {
    await PhongKhoa.deleteMany();
    await User.deleteMany({"chucvu":"admin"});

    let allPhongKhoa = [];
    await config.khoa.forEach(async element => {
        let newPhongKhoa = await new PhongKhoa({
            idphongkhoa: element.id,
            name: element.name
        })
        await allPhongKhoa.push({
            idphongkhoa: element.id,
            name: element.name
        })
        await newPhongKhoa.save();
    });

    let newUser = await new User({
        name: "Admin",
        email: "",
        username: config.admin.username,
        pass: md5(config.admin.pass),
        khoa: "",
        idkhoa: allPhongKhoa,
        lop: "",
        chucvu: "admin",
        avt: "avtsinhvien.png"
    })
    await newUser.save();

    res.send("data: done");
}