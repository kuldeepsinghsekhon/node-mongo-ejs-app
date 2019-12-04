const User = require('../models/User');
exports.listUsers=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    User
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, users) {
            User.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/admin/users', {
                    users: users,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'admin-layout'
                })
            })
        })
  }