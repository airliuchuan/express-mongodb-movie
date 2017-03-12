var User = require('../models/user');

//注册功能
exports.showSignup = function (req, res) {

    res.render('signup', {
        title: '注册'
    })
}

exports.signup =  function (req, res) {
    var _user = req.body.user;

    User.find({name: _user.name}, function (err, user) {
        if (err) {
            console.log(err);
        }
        console.log(user);
        if (user.length !== 0) {

            return res.redirect('/signin');

        } else {

            user = new User(_user);

            user.save(function (err, user) {
                if (err) {
                    console.log(err)
                }

                res.redirect('/');
            })
        }
    })


}

//用户列表页面
exports.userList = function (req, res) {

        User.fetch(function (err, users) {
            if (err) {
                console.log(err);
            }

            res.render('userlist', {
                title: '用户列表页',
                users: users
            })
        })
}

//登录功能路由
exports.showSignin = function (req, res) {

    res.render('signin', {
        title: '登录'
    })
}


exports.signin = function (req, res) {
    var _user = req.body.user;//获取提交的表单
    var name = _user.name;//提交的用户名
    var password = _user.password;//提交的密码

    //以name为标识查找用户条目
    User.findOne({name: name}, function (err, user) {
        if (err) {
            console.log(err);
        }

        if (!user) {//不存在返回主页

            return res.redirect('/signup');

        }
        //bcrypt密码匹对函数comparePassword 在user的schemas里定义
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err);
            }
            //密码正确回到主页
            if (isMatch) {
                req.session.user = user;//将登录用户的信息放到session
                return res.redirect('/');
            } else {//密码错误
                return res.redirect('/signin');
            }
        })
    })
}

//退出登录模块路由
exports.logout = function (req, res) {
    delete req.session.user;
    res.redirect('/');
}

//中间件 登录判断
exports.signinRequired = function (req, res, next) {
    var user = req.session.user;

    if(!user) {
        return res.redirect('/signin');
    }

    next();
}

//中间件 权限判断
exports.adminRequired = function (req, res, next) {
    var user = req.session.user;

    if(user.role <= 10) {
        return res.redirect('/');
    }

    next();
}




