const User = require('../models/User');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const ThongBao = require('../models/ThongBao');


module.exports.home = async (req, res) => {
    let user_id = req.signedCookies.user_id;
    let user = await User.findOne({"_id": user_id})
    let users = await User.find();
    let posts = await Post.find().sort({"_id": -1}).limit(10);
    let likes = await Like.find({"iduser": user_id});
    let commentsOfPost = await Comment.find();
    let likesOfPost = await Like.find();


    let thongbao = await ThongBao.find().sort({"_id": -1}).limit(4);
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
        res.render('trangchu', {user, datapost, thongbao});
    }else{
        res.redirect('/logout');
    }

    
}