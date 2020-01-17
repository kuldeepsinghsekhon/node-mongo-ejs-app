const User = require('../models/User');
exports.listUsers=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
    User.find({})
        //.skip((perPage * page) - perPage)
        //.limit(perPage)
        .exec(function(err, users) {
            User.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/admin/users', {
                    users: users,
                   // current: page,
                    //pages: Math.ceil(count / perPage),
                    layout:'admin-layout'
                })
            })
        })
  }
  exports.updateUserStatus = function(req,res,next){
    var productId = req.body.uid ;
    var status = req.body.status;
    //console.log(status);
    //console.log(uid);
    var prod = {status : status};
    User.findByIdAndUpdate(productId, {$set:prod}, function (err, users) {
        if (err) return next(err);
        res.json({status:'success',data:{users:users},message:'User Action success'});
    });
  }