var mongoose = require('mongoose');
var bcrypt = require('bcrypt');//nodejs加密模块
var SALT_WORK_FACTOR = 10;//bcrypt.genSalt()的第一个参数,配置密码的加密强度

var  UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    //判断用户权限
    //role: String,//user admin superadmin
    role: {
        type: Number,
        default: 0
    },//0: user,1: verified user,2: professonal user
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
UserSchema.pre('save', function(next) {
    var user = this;

    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {//生成随机的盐加密字段
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err,hash) {//生成盐与用户密码的混合字段
            if(err) return next(err);

            user.password = hash;
            next();

        })
    })
});

UserSchema.methods = {
    //bcrypt的加密后的密码匹对函数
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if(err) return cb(err);

            cb(null, isMatch);
        })
    }
}

//为数据库添加一些静态方法(不会直接与数据库交互,必须通过模型实例化后才能用)
UserSchema.statics = {
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

module.exports = UserSchema;