const User = require('../models/User');
const ThongBao = require('../models/ThongBao');
const PhongKhoa = require('../models/PhongKhoa');


const moment = require("moment");
const formidable = require('formidable');




module.exports.trangthongbao = async (req, res) => {
    let user_id = req.signedCookies.user_id;
    var user = await User.findOne({"_id": user_id});
    let thongbao = await ThongBao.find().sort({"_id": -1}).limit(10);
    let thongbaofull = await ThongBao.find().sort({"_id": -1});
    let phongkhoa = await PhongKhoa.find().sort({"idphongkhoa": 1});

    let checkChucVu = true;
    if(user.chucvu == 'sinhvien'){
        checkChucVu = false;
    }

    let page =  Math.ceil(thongbaofull.length / 10);
    let page2 = [];
    for(let i = 1; i <= page; i++){
        if(i == 1){
            page2.push({
                'page': i,
                'active': true
            })
        }else{
            page2.push({
                'page': i,
                'active': false
            })
        }
    }

    let thongbaotmp = thongbao;
    thongbao = [];
    thongbaotmp.forEach((element, index) => {
        index += 1;
        if(index % 2 == 0){
            thongbao.push({
                'thongbao': element,
                'chan': true
            })
        }else{
            thongbao.push({
                'thongbao': element,
                'chan': false
            })
        }
    });

    res.render('trangthongbao', {user, checkChucVu, thongbao, 'page':page2, phongkhoa});
}



module.exports.themthongbao = (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idphongkhoa, title, content} = field;
        dataform.push(idphongkhoa, title, content);

    })

    form.on('end', async function() {
        let phongkhoa = await PhongKhoa.findOne({"idphongkhoa": dataform[0]});
        let thongbaomoi = await new ThongBao({
            'idphongkhoa': Number(dataform[0]),
            'namekhoa': phongkhoa.name,
            'title': dataform[1],
            'content': dataform[2],
            'time': moment().format('HH:mm DD-MM-YYYY')
        })
        await thongbaomoi.save();
        
        res.send(thongbaomoi);
    })

}


module.exports.thongbaotheokhoa = async (req,res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idphongkhoa} = field;
        dataform.push(idphongkhoa);

    })

    form.on('end', async function() {
        if(dataform[0] == 'all'){
            var thongbao = await ThongBao.find().sort({"_id": -1}).limit(10);
            var thongbaofull = await ThongBao.find().sort({"_id": -1});
        }else{
            var thongbao = await ThongBao.find({'idphongkhoa':Number(dataform[0])}).sort({"_id": -1}).limit(10);
            var thongbaofull = await ThongBao.find({'idphongkhoa':Number(dataform[0])}).sort({"_id": -1});
        }
        let page =  Math.ceil(thongbaofull.length / 10);
        res.send({
            'thongbao': thongbao,
            'page': page
        });
    })
}

module.exports.taithongbaophantrang = async (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idphongkhoa, page} = field;
        dataform.push(idphongkhoa, page);

    })

    form.on('end', async function() {
        var index = (Number(dataform[1]) - 1 ) * 10;
        if(dataform[0] == 'all'){
            var thongbao = await ThongBao.find().sort({"_id": -1}).skip(index).limit(10);
        }else{
            var thongbao = await ThongBao.find({'idphongkhoa':Number(dataform[0])}).sort({"_id": -1}).skip(index).limit(10);
        }
        res.send(thongbao);
    })
}

module.exports.chitietthongbao = async (req, res) =>{
    let idthongbao = req.params.idthongbao;
    var thongbao = await ThongBao.findOne({'_id': idthongbao});
    let user_id = req.signedCookies.user_id;
    let user = await User.findOne({"_id": user_id});

    if(user.chucvu == 'sinhvien'){
        res.render('trangchitietthongbao', {
            'thongbao': thongbao,
            'xoasua': false,
            'user':user
        });
    }

    if(user.chucvu == 'admin'){
        res.render('trangchitietthongbao', {
            'thongbao': thongbao,
            'xoasua': true,
            'user':user
        });
    }

    if(user.chucvu == 'phongkhoa'){
        user.idkhoa.forEach(element => {
            if(element.idphongkhoa == thongbao.idphongkhoa){
                res.render('trangchitietthongbao', {
                    'thongbao': thongbao,
                    'xoasua': true,
                    'user':user
                });
            }
        });

        res.render('trangchitietthongbao', {
            'thongbao': thongbao,
            'xoasua': false,
            'user':user
        });
    }
}

module.exports.xoathongbao = async (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idthongbao} = field;
        dataform.push(idthongbao);

    })

    form.on('end', async function() {
        await ThongBao.deleteOne({'_id':dataform[0]});
        res.send('');
    })
}

module.exports.capnhatthongbao = async (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idthongbao, title, content} = field;
        dataform.push(idthongbao, title, content);

    })

    form.on('end', async function() {
        await ThongBao.findOneAndUpdate({"_id": dataform[0]}, {$set:{'title': dataform[1], 'content': dataform[2]}});
        res.send('');
    })
}
