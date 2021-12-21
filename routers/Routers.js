const express = require('express')
const Router = express.Router();
const passport = require('passport')


Router.use(passport.initialize());
//Router.use(passport.session());



const HomeController = require('../controllers/HomeController');
const LoginController = require('../controllers/LoginController');
const UserController = require('../controllers/UserController');
const PostController = require('../controllers/PostController');
const StartController = require('../controllers/StartController');
const ThongBaoController = require('../controllers/ThongBaoController');

const isLogin = (req, res, next) => {
    try {
        if(req.signedCookies.user_id && req.signedCookies.user_id != ""){
            next();
        }else{
            res.redirect('/login');
        }
    } catch (error) {
        res.redirect('/login');
    }
}

const isAdmin = (req, res, next) => {
    try {
        if(req.signedCookies.user_id && req.signedCookies.user_id != "" && req.signedCookies.chucvu && req.signedCookies.chucvu == "admin"){
            next();
        }else{
            res.redirect('/login');
        }
    } catch (error) {
        res.redirect('/login');
    }
}

const isPhongKhoa = (req, res, next) => {
    try {
        if(req.signedCookies.user_id && req.signedCookies.user_id != "" && req.signedCookies.chucvu && req.signedCookies.chucvu == "phongkhoa"){
            next();
        }else{
            res.redirect('/login');
        }
    } catch (error) {
        res.redirect('/login');
    }
}

const isAdminOrPhongKhoa = (req, res, next) => {
    try {
        if(req.signedCookies.user_id && req.signedCookies.user_id != "" && req.signedCookies.chucvu){
            if(req.signedCookies.chucvu == "phongkhoa" || req.signedCookies.chucvu == "admin"){
                next();
            }else{
                res.redirect('/login');
            }
        }else{
            res.redirect('/login');
        }
    } catch (error) {
        res.redirect('/login');
    }
}

Router.get('/',isLogin, HomeController.home)


Router.get('/login', LoginController.login);
Router.post('/loginbyusername', LoginController.loginByUsername);
Router.get('/logout', LoginController.logout);
Router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
Router.get('/auth/google/callback', 
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            const email = req.user.emails[0].value;
            const name = req.user.displayName;
            let url = '/user/addstudent/' +  email + "/" + name;
            res.redirect(url);
        }
    );


Router.get('/user/addstudent/:email/:name', UserController.addStudent);
Router.get('/trangthongtincanhan',isLogin, UserController.thongTinCaNhan);
Router.post('/capnhatthongtincanhan',isLogin, UserController.capnhatthongtincanhan);
Router.get('/nguoidung', isAdmin, UserController.trangnguoidung);
Router.post('/themnguoidung', isAdmin, UserController.themnguoidung);
Router.post('/doimatkhau', isAdminOrPhongKhoa, UserController.doimatkhau);
Router.get('/trangdoimatkhau', isAdminOrPhongKhoa, UserController.trangdoimatkhau);
Router.get("/trangcanhan/:iduser", isLogin, UserController.trangcanhan);


Router.post('/uppost', isLogin, PostController.upPost);
Router.post('/getpost', isLogin, PostController.getPost);
Router.post('/editpost', isLogin, PostController.editPost);
Router.post('/deletepost', isLogin, PostController.deletePost);
Router.post('/uppostyoutube', isLogin, PostController.upPostYoutube);
Router.post('/editpostyoutube', isLogin, PostController.editPostYoutube);
Router.post('/likepost', isLogin, PostController.likePost);
Router.post('/upcomment', isLogin, PostController.upComment);
Router.post('/loadcomment', isLogin, PostController.loadComment);
Router.post('/deletecomment', isLogin, PostController.deleteComment);
Router.post('/loadpost', isLogin, PostController.loadPost);



Router.get("/trangthongbao", isLogin, ThongBaoController.trangthongbao);
Router.post("/themthongbao", isAdminOrPhongKhoa, ThongBaoController.themthongbao);
Router.post("/thongbaotheokhoa", isLogin, ThongBaoController.thongbaotheokhoa);
Router.post("/taithongbaophantrang", isLogin, ThongBaoController.taithongbaophantrang);
Router.get("/chitietthongbao/:idthongbao", isLogin, ThongBaoController.chitietthongbao);
Router.post("/xoathongbao", isLogin, ThongBaoController.xoathongbao);
Router.post("/capnhatthongbao", isLogin, ThongBaoController.capnhatthongbao);


//Khoi tao he thong
//chay route nay để tạo tài khoảng admin và setup các phòng khoa từ file config vào db
Router.get('/start', StartController.start);





module.exports = Router;