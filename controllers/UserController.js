const User = require('../models/User');
const PhongKhoa = require('../models/PhongKhoa');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const formidable = require('formidable');
const md5 = require('md5');
const fs = require("fs");



module.exports.addStudent = (req, res) => {
    let email = req.params.email;
    let dotemail = email.split('@')[1]
    let name = req.params.name;
    
    if (dotemail !== 'student.tdtu.edu.vn') {
       res.render('trangdangnhap', {error: "Vui lòng sử dụng email sinh viên để đăng nhập!"})
    } else {
       //tìm email trong mongo
       User.findOne({ email: email })
            .then(u => {
                if (u) {
                    res.cookie('user_id', u.id, {signed: true}, { expires: new Date(Date.now() + 60000*60*24*60), httpOnly: false });
                    res.cookie('chucvu', u.chucvu, {signed: true}, { expires: new Date(Date.now() + 60000*60*24*60), httpOnly: false });
                    res.redirect('/');
                } else {
                    let newUser = new User({
                        name: name,
                        email: email,
                        username: "",
                        pass: "",
                        khoa: "",
                        idkhoa: "",
                        lop: "",
                        chucvu: "sinhvien",
                        avt: "avtsinhvien.png"
                    })
                    newUser.save();
                    res.cookie('user_id', newUser.id, {signed: true}, { expires: new Date(Date.now() + 60000*60*24*60), httpOnly: false });
                    res.cookie('chucvu', newUser.chucvu, {signed: true}, { expires: new Date(Date.now() + 60000*60*24*60), httpOnly: false });
                    res.redirect('/');
                }
            })
            .then(() => {

                res.redirect('/login');

            })

            .catch((e) => {
                console.log('Add student error: ', e.message)
        })
    }

    return;
}

module.exports.thongTinCaNhan = async (req, res) => {
    let user_id = req.signedCookies.user_id;
    var user = await User.findOne({"_id": user_id})
    if(user){
        res.render('trangthongtincanhan', {user});
    }else{
        res.redirect('/logout');
    }

}

module.exports.capnhatthongtincanhan = (req, res) => {

    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    var avt = [];
    form.parse(req, function(err, field, files) {
        const {name, lop, khoa} = field;
        dataform.push(name, lop, khoa);

    })

    form.on('fileBegin', function(name, file) {
        var now = Date.now();
        var filedot = file.name.split(".");      
        let avtname = md5(now + file.name) + "." + filedot[filedot.length - 1];
        file.path = `public/images/${avtname}`;
        avt.push(avtname);
    });

    form.on('end', async function() {
        let oldInfo = await User.findOneAndUpdate(
            {"_id":req.signedCookies.user_id},
            {
                name: dataform[0],
                lop:dataform[1],
                khoa:dataform[2]
            }
        )
        
        if(avt.length > 0){
            await User.findOneAndUpdate(
                {"_id":req.signedCookies.user_id},
                {
                    avt: avt[0]
                }
            )
            
            //xoá file cũ
            //process.cwd() đường dẫn đến file tổng
            fs.unlink(process.cwd() + '/public/images/' + oldInfo.avt, function (err) {            
                if (err) {                                                 
                    console.error("Khong the xoa file logo cũ");                                    
                }                                                                                  
            });  
        }

        res.send("");
    })
}

module.exports.trangnguoidung = async (req, res) => {
    let user_id = req.signedCookies.user_id;
    let user = await User.findOne({"_id": user_id});
    let phongkhoa = await PhongKhoa.find().sort({"idphongkhoa": 1});
    let listuserdb = await User.find({'chucvu':'phongkhoa'});
    let listuser = [];
    listuserdb.forEach((element, index) => {
        index += 1;
        if(index % 2 == 0){
            listuser.push({
                'chan':true,
                'stt':index,
                'phongkhoa':element
            })
        }else{
            listuser.push({
                'chan':false,
                'stt':index,
                'phongkhoa':element
            })
        }
    });

    console.log(listuser);
    res.render('trangnguoidung', {'user':user, 'phongkhoa':phongkhoa, 'listuser':listuser});
}

module.exports.themnguoidung = async (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {name, username, password, phongkhoa} = field;
        dataform.push(name, username, password, phongkhoa);

    })

    form.on('end', async function() {
        let phongkhoa = dataform[3].split(' ');
        let phongkhoadb = [];
        for(let i = 0; i < phongkhoa.length - 1; i++){
            let pk = await PhongKhoa.findOne({'idphongkhoa': Number(phongkhoa[i])});
            phongkhoadb.push({
                'idphongkhoa':  pk.idphongkhoa,
                'name':  pk.name
            })

        }

        let user = await User.findOne({'username': dataform[1]});
        if(user){
            res.send({'code': 404});
        }else{
            let newUser = await new User({
                name: dataform[0],
                email: "",
                username: dataform[1],
                pass: md5(dataform[2]),
                khoa: "",
                idkhoa: phongkhoadb,
                lop: "",
                chucvu: "phongkhoa",
                avt: "avtsinhvien.png"
            })
            await newUser.save();
    
            res.send({'code': 200});

        }
    })
}



module.exports.doimatkhau = (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    var avt = [];
    form.parse(req, function(err, field, files) {
        const {oldpass, newpass} = field;
        dataform.push(oldpass, newpass);

    })

    form.on('end', async function() {
        let user_id = req.signedCookies.user_id;
        let user = await User.findOne({"_id": user_id});

        if(user){
            if(user.pass == md5(dataform[0])){
                await User.findOneAndUpdate({"_id": user_id}, {$set:{pass: md5(dataform[1])}});
                res.send({'code': 200});
            }else{
                res.send({'code': 404});
            }
        }else{
            res.send({'code': 404});
        }
    })

}

module.exports.trangdoimatkhau = async (req, res) => {
    let user_id = req.signedCookies.user_id;
    let user = await User.findOne({"_id": user_id});
    res.render('trangdoimatkhau', {user});
}

module.exports.trangcanhan = async (req, res) => {
    let user_id = req.signedCookies.user_id;
    let iduser = req.params.iduser;
    let user = await User.findOne({"_id": user_id})
    let users = await User.find();
    let posts = await Post.find({'user': iduser}).sort({"_id": -1});
    let likes = await Like.find({"iduser": user_id});
    let commentsOfPost = await Comment.find();
    let likesOfPost = await Like.find();


    let datapost = []
    posts.forEach(post => {
        users.forEach(userpost => {
            if(post.user == userpost.id){
                let actionLike = false;
                let countLike = 0;
                let countComment = 0;
                likes.forEach(like => {
                    if(like.idpost == post.id && like.iduser == user_id){
                        actionLike = true;
                    }
                })


                likesOfPost.forEach(like => {
                    if(like.idpost == post.id){
                        countLike += 1;
                    }
                })

                commentsOfPost.forEach(c => {
                    if(c.idpost == post.id){
                        countComment += 1;
                    }
                })


                if(userpost.id == user.id){
                    if(actionLike){
                        datapost.push({
                            "user": userpost,
                            "post": post,
                            "chinhchu": true,
                            "like": true,
                            "countLike": countLike,
                            "countComment": countComment,
                            "avt": user.avt
                        })
                    }else{
                        datapost.push({
                            "user": userpost,
                            "post": post,
                            "chinhchu": true,
                            "like": false,
                            "countLike": countLike,
                            "countComment": countComment,
                            "avt": user.avt
                        })
                    }
                }else{
                    if(actionLike){
                        datapost.push({
                            "user": userpost,
                            "post": post,
                            "chinhchu": false,
                            "like": true,
                            "countLike": countLike,
                            "countComment": countComment,
                            "avt": user.avt
                        })
                    }else{
                        datapost.push({
                            "user": userpost,
                            "post": post,
                            "chinhchu": false,
                            "like": false,
                            "countLike": countLike,
                            "countComment": countComment,
                            "avt": user.avt
                        })
                    }
                }
            }
        })
    });
    if(user){
        res.render('trangcanhan', {user, datapost});
    }else{
        res.redirect('/logout');
    }

    
}


