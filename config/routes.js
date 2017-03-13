var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

module.exports = function(app) {

//预处理user
    app.use(function (req, res, next) {
        var _user = req.session.user;

        app.locals.user = _user;//模板传值对象locals,app.locals为全局,res.locals为局部

        next();
    })

    // 主页
    app.get('/', Index.index);

    //用户相关
    app.post('/user/signup', User.signup);//注册
    app.get('/admin/user/list', User.signinRequired,User.adminRequired,User.userList);//用户列表
    app.post('/user/signin', User.signin);//登录
    app.get('/signup', User.showSignup);//显示注册界面
    app.get('/signin', User.showSignin);//显示登录界面
    app.get('/logout', User.logout);//登出

    //电影相关
    app.get('/movie/:id', Movie.detail);//电影详情页
    app.get('/admin/movie', User.signinRequired,User.adminRequired,Movie.new);//电影后台录入页面
    app.get('/admin/movie/update/:id', User.signinRequired,User.adminRequired,Movie.update);//电影更新条目功能
    app.post('/admin/movie/new', User.signinRequired,User.adminRequired,Movie.savePoster, Movie.save);//电影信息录入页面
    app.get('/admin/movie/list', User.signinRequired,User.adminRequired,Movie.movieList);//电影列表页面
    app.delete('/admin/movie/list', User.signinRequired,User.adminRequired,Movie.del);//电影条目删除功能

    //评论功能
    app.post('/user/comment', User.signinRequired, Comment.save);

    //后台分类
    app.get('/admin/category', User.signinRequired,User.adminRequired,Category.new);
    app.post('/admin/category/new', User.signinRequired,User.adminRequired,Category.save);
    app.get('/admin/category/list', User.signinRequired,User.adminRequired,Category.list);

    //分页功能
    app.get('/results', Index.search);



}