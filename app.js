var express = require('express');
var path = require('path');//生成一个合法的路径
var logger = require('morgan');//express.logger在4.0已经独立出模块
var bodyParser = require('body-parser');//用于处理post请求提交的数据
var mongoose = require('mongoose');//数据库操作模块
var session = require('express-session');//用于存储用户登录状态
var cookieParser = require('cookie-parser');//cookie模块用来支持session模块
//用于session持久化,这里要把session模块最作为参数
var MongoStore = require('connect-mongo')(session);
var port = process.env.PORT || 3000;
var app = express();//启动web服务器
var fs = require('fs');

var dbUrl = 'mongodb://localhost/imooc';

//链接mongodb数据库
mongoose.Promise = require('bluebird');
mongoose.connect(dbUrl,function(err) {
    if(!err) {
        console.log('connected to Mongodb');
    }else {
        throw err
    }
});

//mongdb 模型加载:可以以test文件下user.js文件的那种引用方法应用mongodb实例
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs
        .readdirSync(path)
        .forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);

            if(stat.isFile()) {
                if(/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath);
                }
            }
            else if(stat.isDirectory()) {
                walk((newPath))
            }
        })
};
walk(models_path)

app.set('views','./app/views/pages');//设置模板视图的根目录
app.set('view engine','jade');//默认的模板引擎
app.use(bodyParser.json());
//可以解析post请求的body,dang extended为false时出现了解析不正确的表单提交数据??
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());//启动cookie
app.use(require('connect-multiparty')());//用于表单上传文件
//启动会话状态session
app.use(session({
    secret: 'imooc',
    store: new MongoStore({//session持久化功能实现
        url: dbUrl,//mongodb的链接地址
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true
}))

//
if('development' === app.get('env')) {
    app.set('showStackError', true);//可以在控制台打印错误信息
    app.use(logger(':method :url :status'));//在控制台显示()内的信息
    app.locals.pretty = true;//将网页显示的压缩代码格式化
    mongoose.set('debug', true);//打印mongodb操作信息
}

require('./config/routes')(app);

app.listen(port);
app.use(express.static(path.join(__dirname, 'public')));//设置静态目录
app.locals.moment = require('moment');
console.log('started on port ' + port);



