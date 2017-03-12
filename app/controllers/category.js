var Category = require('../models/category');


//后台电影条目录入页
exports.new = function (req, res) {

    res.render('category_admin', {
        title: '后台分类录入页面',
        category: {}
    })

}


//分类录入处理页面
exports.save = function (req, res) {

    var _category = req.body.category;

    var category = new Category(_category);

    category.save(function (err, category) {
            if (err) {
                console.log(err)
            }

            res.redirect('/admin/category/list')
        })

}

//分类列表页面
exports.list = function (req, res) {

    Category.fetch(function (err, categories) {
        if (err) {
            console.log(err);
        }

        res.render('categorylist', {
            title: '分类列表页',
            categories: categories
        })
    })
}