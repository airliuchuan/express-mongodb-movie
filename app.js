var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');//数据库模块
var _ = require('underscore');//
var Movie = require('./models/movie');
var port = process.env.PORT || 3000;
var app = express();//启动web服务器
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/imooc',function(err) {
    if(!err) {
        console.log('connected to Mongodb');
    }else {
        throw err
    }

});


app.set('views','./views/pages');//设置视图的根目录
app.set('view engine','jade');//默认的模板引擎
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));//可以解析post请求的body,dang extended为false时出现了解析不正确的表单提交数据??
app.use(express.static(path.join(__dirname, 'public')));//设置静态目录
app.locals.moment = require('moment');
app.listen(port);

console.log('started on port ' + port);

// index page
app.get('/', function(req, res) {
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err);
        }

        res.render('index', {
            title: '电影首页',
            movies: movies
        })
    })

});

app.get('/movie/:id', function(req, res) {
    var id = req.params.id;

    Movie.findById(id, function(err,movie) {
        if(err) {
            console.log(err)
        }
        res.render('detail', {
            title: movie.title + '详情页',
            movie: movie
        })
    })

});

app.get('/admin/list', function(req, res) {
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err);
        }

        res.render('list', {
            title: '电影列表页',
            movies: movies
        })
    })
});

app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: '后台录入页面',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
})

//admin update movie
app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id;

    if(id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin',{
                title: '后台更新页面',
                movie: movie
            })
        })
    }
})

//admin post movie
app.post('/admin/movie/new', function(req, res) {
    console.log(req.body);
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if(id!=='undefined') {
        Movie.findById(id, function(err, movie) {
            if(err) {
                console.log()
            }

            _movie = _.extend(movie, movieObj);
            _movie.save(function(err,movie) {
                if(err) {
                    console.log(err)
                }

                res.redirect('/movie/' + movie._id);
            })
        })
    }else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            language: movieObj.language,
            country: movieObj.country,
            summary: movieObj.summary,
            poster: movieObj.poster,
            year: movieObj.year,
            flash: movieObj.flash
        });

        _movie.save(function(err, movie) {
            if(err) {
                console.log(err)
            }

            res.redirect('/movie/' + movie._id)
        })

    }
})

app.delete('/admin/list',function(req,res) {
    var id = req.query.id;
    if(id) {
        Movie.remove({_id: id},function(err,movie) {
            if(err){
                console.log(err);
            }
            else{
                res.json({success: 1});
            }
        })
    }
})