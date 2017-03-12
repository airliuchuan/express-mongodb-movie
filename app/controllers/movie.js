var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('underscore');//此模块的extend方法能用某值替换某值
var fs = require('fs');
var path = require('path');

//电影详情页
exports.detail = function (req, res) {
    var id = req.params.id;//url上:id的:是用来定义变量id的
    //update()可以查询某个id别点击的次数,只需在schemas里面设置好pv
    Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
        if(err) {
            console.log(err);
        }
    });

    Movie.findById(id, function (err, movie) {

        if (err) {
            console.log(err)
        }


        Comment.find({movie: id})
        .populate('from','name')//populate方法通过ObjectId获取到对应_id的数据,通过from的ObjectId去查他本身所在数据表的name属性
        .populate('reply.from reply.to', 'name')
        .exec(function(err, comments) {
            console.log(comments);
            res.render('detail', {
                title: movie.title + '详情页',
                movie: movie,
                comments: comments
            })
        })

    })

}

//后台列表页
exports.movieList = function (req, res) {

        Movie.find({})
            .populate('category', 'name')
            .exec(function(err, movies){
                if (err) {
                    console.log(err);
                }

                res.render('list', {
                    title: '电影列表页',
                    movies: movies
                })
            });
}

//后台电影条目录入页
exports.new = function (req, res) {
        Category.find({}, function(err, categories){
            res.render('admin', {
                title: '后台录入页面',
                categories: categories,
                movie: {}
            })
        })


}

//电影后台列表页更新功能
exports.update = function (req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function (err, movie) {
            Category.find({}, function(err, categories) {
                res.render('admin', {
                    title: '后台更新页面',
                    movie: movie,
                    categories: categories
                })
            })

        })
    }
}

//后台录入处理页面
exports.save = function (req, res) {

    var id = req.body.movie._id;
    var movieObj = req.body.movie;

    var _movie;
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err)
            }

            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err)
                }

                res.redirect('/movie/' + movie._id);
            })
        })
    } else {
        _movie = new Movie(movieObj);//这里的意思就是创建一个新的文档

        var categoryId = movieObj.category;
        var categoryName = movieObj.categoryName;
        console.log(movieObj)
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err)
            }

            if(categoryId) {
                //在admin.jade里吧categories的_id存进movies表里,然后通过这个id用findById找到对应的分类的表格,在吧movie的_id用push的方法放到赋给movies
                Category.findById(categoryId,function(err, category) {
                    category.movies.push(movie._id);

                    category.save(function(err, category){
                        if(err) {
                            console.log(err)
                        }

                        res.redirect('/movie/' + movie._id)
                    });
                })
            }else if(categoryName) {
                var category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                });

                category.save(function(err, category){
                    if(err) {
                        console.log(err)
                    }

                    movie.category  = category._id;
                    movie.save(function(err, movie) {
                        res.redirect('/movie/' + movie._id);//这个跳转都要放在save()这个方法里边,有点不解
                    })
                });
            }
        })

    }
}

//海报上传功能
exports.savePoster = function(req, res, next) {
    var posterData = req.files.uploadPoster;
    var filePath = posterData.path;
    var originalFilename = posterData.originalFilename;

    if(originalFilename) {

        var timestamp = Date.now();
        var type = posterData.type.split('/')[1];
        var poster = timestamp + '.' + type;
        var newPath = path.join(__dirname, '../../', '/public/upload/' + poster );

        fs.rename(filePath, newPath, function(err) {
            console.log(req.body.movie.poster + '海报上传');
            req.body.movie.poster = poster;
            next();

        });
    }else {
        next();
    }
}

//电影列表页面删除功能
exports.del = function (req, res) {
    var id = req.query.id;
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            }
            else {
                res.json({success: 1});
            }
        })
    }
}
