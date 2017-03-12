var Movie = require('../models/movie');
var Category = require('../models/category');

// 主页
exports.index = function(req, res) {
    //Catgory.find({})的结果,用populate()处理了一下,将里边的ObjectId与ref对应的数据模型相映射
    Category.find({})
        .populate({path: 'movies', select:'title poster', options: {limit: 6}})//options下的limit限制电影条目,path属性是从category哪个属性里找,select属性:选定目标字段
        .exec(function(err, categories) {
            if(err) {
                console.log(err);
            }

            res.render('index', {
                title: '电影首页',
                categories: categories
            })

        })

}

// //这是用populate()的options下面的skip属性,实现的分页;
// exports.search = function(req, res) {
//     var catId = req.query.cat;
//     var page = req.query.p;
//     var index = page * 2;
//
//     Category.find({_id: catId})
//         .populate({path: 'movies', select:'title poster', options: {limit: 2, skip: index}})//options下的skip:从哪条数据开始查
//         .exec(function(err, categories) {
//             if(err) {
//                 console.log(err);
//             }
//             console.log(categories);
//             var category = categories[0] || {}
//             res.render('result', {
//                 title: '查询结果列表页',
//                 keyword: category.name,
//                 category: category
//             })
//
//         })
//
// }

//这是自己写的分页逻辑
exports.search = function(req, res) {
    var catId = req.query.cat;
    var q = req.query.q;
    var count = 2;
    var page = req.query.p * 1 || 0;
    var index = page * count;

    if(catId) {
        Category.find({_id: catId})
            .populate({path: 'movies', select:'title poster'})
            .exec(function(err, categories) {
                if(err) {
                    console.log(err);
                }

                var category = categories[0] || {};
                var movies = category.movies || [];
                var results = movies.slice(index, index + count);

                res.render('result', {
                    title: '查询结果列表页',
                    keyword: category.name,
                    query: 'cat=' + catId,
                    currentPage: (page + 1),//当前页面
                    totalPage: Math.ceil(movies.length / count),//总共页数(Math.ceil()是向上取整的方法)
                    movies: results
                })

            })
    }else {
        var reg = new RegExp(q + '.*', 'i');//正则匹配
        Movie.find({title: reg})
            .exec(function(err, movies) {//这个movies是个数组
                if(err) {
                    console.log(err);
                }
                console.log(movies)
                var results = movies.slice(index, index + count);

                res.render('result', {
                    title: '查询结果列表页',
                    keyword: q,
                    query: 'q=' + q,
                    currentPage: (page + 1),//当前页面
                    totalPage: Math.ceil(movies.length / count),//总共页数(Math.ceil()是向上取整的方法)
                    movies: results
                })
            })
    }


}