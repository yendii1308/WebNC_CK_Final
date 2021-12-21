const User = require('../models/User');
const md5 = require('md5');
const formidable = require('formidable');



module.exports.login = (req, res) => {
    res.render('trangdangnhap');
}

module.exports.logout = (req, res) => {
    res.cookie('user_id', '', {signed: true}, { expires: new Date(0), httpOnly: false});
    res.cookie('chucvu', '', {signed: true}, { expires: new Date(0), httpOnly: false });
    res.redirect('/login');
}

module.exports.loginByUsername = (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {username, pass} = field;
        dataform.push(username, pass);
    })

    form.on('end', async function() {
        let user = await User.findOne({"username": dataform[0], pass: md5(dataform[1])});
        
        if(user != null){
            res.cookie('user_id', user.id, {signed: true}, { expires: new Date(Date.now() + 60000*60*24*60), httpOnly: false });
            res.cookie('chucvu', user.chucvu, {signed: true}, { expires: new Date(Date.now() + 60000*60*24*60), httpOnly: false });
            res.send({"code": 200});
        }else{
            res.send({"code": 400});
        }
    })
}