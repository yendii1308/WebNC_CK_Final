const express = require("express");
const config = require("./config.json");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
var hbs = require('express-handlebars');



const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//Tạo socket 
io.on('connection', function (socket) {
    socket.on('thongbao', function (data) {
        io.sockets.emit('thongbao', data);
    });
});

//cài đặt view engine
//cài đặt view engine
//app.engine('hbs', hbs({helpers: require("./public/javascripts/helpers.js").helpers,extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");


//cài đặt đường dẫn đến mục public
app.use(express.static(__dirname + "/public"));



//cài đặt session
app.use(session({ 
    secret: 'anything',
    resave: true,
    saveUninitialized: true}));
//Cai đặt cookie
app.use(cookieParser("thisiskey"));

//chuyển routers nhận được sang ./routes/Routes.js
const Routers = require("./routers/Routers.js");
app.use("/", Routers);

//khởi tạo Google oauth
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
        clientID: config.google_key,
        clientSecret: config.google_secret,
        callbackURL: config.google_callback_url,
        passRegToCallback: true,
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile)
    }
));


mongoose.connect(config.database.link_connect_bd, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    const PORT = process.env.PORT || 8000;
    http.listen(PORT, () => {
        console.log('http://localhost:' + PORT)
    });
})
.catch(e => console.log('Không thể kết nối tới db server: ' + e.message))


