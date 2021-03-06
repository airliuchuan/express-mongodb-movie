var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//每一个Schema都会有一个默认的ObjectId属性,属性名为_id
var ObjectId = Schema.Types.ObjectId;

var  CategorySchema = new Schema({
    name: String,
    movies: [{type: ObjectId, ref: 'Movie'}],//ref的值应该是实例化之后的模块
    meta: {//更新数据的时间记录
        createAt: {
            type: Date,
            dafault: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

//这个函数的意思就是: 每次save的时候都会调用后边的方法
CategorySchema.pre('save', function(next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }

    next();//将存储流程进行下去
});

//为数据库添加一些静态方法(不会直接与数据库交互,必须通过模型实例化后才能用)
CategorySchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    },
};

module.exports = CategorySchema;