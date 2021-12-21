const formidable = require('formidable');
const md5 = require('md5');
const moment = require("moment");

const Post = require('../models/Post');
const User = require('../models/User');
const Like = require('../models/Like');
const Comment = require('../models/Comment');


module.exports.upPost = (req, res) => {

    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    var image = [];
    form.parse(req, function(err, field, files) {
        const {content} = field;
        dataform.push(content);

    })

    form.on('fileBegin', function(name, file) {
        var now = Date.now();
        var filedot = file.name.split(".");      
        let imagename = md5(now + file.name) + "." + filedot[filedot.length - 1];
        file.path = `public/images/${imagename}`;
        image.push(imagename);
    });

    form.on('end', async function() {
        if(image.length > 0){
            let newPost = new Post({
                user: req.signedCookies.user_id,
                type: "post",
                content: dataform[0],
                image: image[0],
                idyoutube: "",
                time: moment().format('HH:mm DD-MM-YYYY')
            });
            newPost.save();
            let user = await User.findOne({"_id": req.signedCookies.user_id});
            let data = {
                user: user,
                post: newPost
            }
            res.send(data);
        }else{
            let newPost = new Post({
                user: req.signedCookies.user_id,
                type: "post",
                content: dataform[0],
                image: "",
                idyoutube: "",
                time: moment().format('HH:mm DD-MM-YYYY')
            });
            newPost.save();

            let user = await User.findOne({"_id": req.signedCookies.user_id});
            let data = {
                user: user,
                post: newPost
            }
            res.send(data);
        }
    })
}

module.exports.getPost = (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idpost} = field;
        dataform.push(idpost);
    })

    form.on('end', async function() {
        let post = await Post.findOne({"_id":dataform[0]})
        res.send(post);
    })
}

module.exports.editPost = (req, res) => {

    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    var image = [];
    form.parse(req, function(err, field, files) {
        const {idpost, content} = field;
        dataform.push(idpost, content);

    })

    form.on('fileBegin', function(name, file) {
        var now = Date.now();
        var filedot = file.name.split(".");      
        let imagename = md5(now + file.name) + "." + filedot[filedot.length - 1];
        file.path = `public/images/${imagename}`;
        image.push(imagename);
    });

    form.on('end', async function() {
        if(image.length > 0){
            await Post.findOneAndUpdate(
                {"_id": dataform[0]},
                {
                    content: dataform[1],
                    image:image[0]
                }
            )
        }else{
            await Post.findOneAndUpdate(
                {"_id": dataform[0]},
                {
                    content: dataform[1]
                }
            )
        }

        let post = await Post.findOne({"_id":dataform[0]})
        console.log(post);
        res.send(post);
    })
}



module.exports.deletePost = (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idpost} = field;
        dataform.push(idpost);
    })

    form.on('end', async function() {
        await Post.deleteOne({ '_id': dataform[0] });
        await Like.deleteMany({ 'idpost': dataform[0] });
        await Comment.deleteMany({ 'idpost': dataform[0] });
        res.send("");
    })
}

module.exports.upPostYoutube = (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idyoutube} = field;
        dataform.push(idyoutube);
    })

    form.on('end', async function() {
        let newPost = new Post({
            user: req.signedCookies.user_id,
            type: "youtube",
            content: "",
            image: "",
            idyoutube: dataform[0],
            time: moment().format('HH:mm DD-MM-YYYY')
        });

        newPost.save();
        let user = await User.findOne({"_id": req.signedCookies.user_id});
        let data = {
            user: user,
            post: newPost
        }
        res.send(data);
    })
}

module.exports.editPostYoutube = (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idpost, idyoutube} = field;
        dataform.push(idpost, idyoutube);
    })

    form.on('end', async function() {
        let post = await Post.findOneAndUpdate(
            {"_id": dataform[0]},
            {
                idyoutube: dataform[1]
            }
        )


        console.log(post);
        res.send(post);
    })
}

module.exports.likePost = (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idpost} = field;
        dataform.push(idpost);
    })

    form.on('end', async function() {
        let liked = await Like.findOne({idpost: dataform[0], iduser: req.signedCookies.user_id});
        if(liked){
            await Like.deleteOne({idpost: dataform[0], iduser: req.signedCookies.user_id});
            let like = await Like.find({idpost:dataform[0]});
            res.send({"action": "dislike", "countlike": like.length});
        }else{
            let newLike = await new Like({
                idpost: dataform[0],
                iduser: req.signedCookies.user_id
            });
            await newLike.save();
            let like = await Like.find({idpost:dataform[0]});
            res.send({"action": "like", "countlike": like.length});
        }
        
    })
}

module.exports.upComment = (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idpost,  content} = field;
        dataform.push(idpost, content);
    })

    form.on('end', async function() {
        let newComment = new Comment({
            iduser: req.signedCookies.user_id,
            idpost: dataform[0],
            content: dataform[1],
            time: moment().format('HH:mm DD-MM-YYYY')
        });
        newComment.save();
        let user = await User.findOne({"_id": req.signedCookies.user_id});
        let  comments = await Comment.find({idpost:dataform[0]});

        res.send({"comment": newComment, "user": user, "countComment": comments.length});
    })
}


module.exports.loadComment = (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idpost} = field;
        dataform.push(idpost);
    })

    form.on('end', async function() {
        let comments = await Comment.find({"idpost": dataform[0]});
        let post = await Post.findOne({"_id": dataform[0]});
        let users = await User.find();
        
        let dataComments = [];
        if(comments.length > 0){
            comments.forEach(comment => {
                users.forEach(user => {
                    if(user.id == comment.iduser){
                        dataComments.push({
                            "comment": comment,
                            "user": user
                        })
                    }
                })
            })

            res.send({
                "comments": dataComments,
                "iduser": req.signedCookies.user_id,
                "iduserpost": post.user
            });
        }else{
            res.send([]);
        }
    })
}

module.exports.deleteComment = (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idcomment} = field;
        dataform.push(idcomment);
    })

    form.on('end', async function() {
        await Comment.deleteOne({ '_id': dataform[0] });
        res.send("");
    })
}

module.exports.loadPost = (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {index} = field;
        dataform.push(index);
    })

    form.on('end', async function() {
        let user_id = req.signedCookies.user_id;
        let user = await User.findOne({"_id": user_id})
        let users = await User.find();
        let posts = await Post.find().sort({"_id": -1}).skip(dataform[0]*10).limit(10);
        let likes = await Like.find({"iduser": user_id});
        let commentsOfPost = await Comment.find();
        let likesOfPost = await Like.find();
    
        let datapost = []
        await posts.forEach(post => {
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

        res.send({user, datapost});
    })
}

