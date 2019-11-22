const Address = require('../models/Address');
exports.settings=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Address
        .find({})
        .exec(function(err, users) {
            Address.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/users/setting', {
                    users: users,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  }
  exports.buyerInfo=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Address
        .find({})
        .exec(function(err, users) {
            Address.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/users/settings-buyer-info', {
                    users: users,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  }
  exports.shippingInfo=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Address
        .find({})
        .exec(function(err, users) {
            Address.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/users/settings-shipping-info', {
                    users: users,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  }
  exports.sellerInfo=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Address
        .find({})
        .exec(function(err, users) {
            Address.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/users/settings-seller-info', {
                    users: users,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  }
  exports.payoutInfo=function(req,res,next){
      res.render('pages/users/settings-payout-info')
  }
  
  exports.editProfile=function(req,res,next){
    res.render('pages/users/settings-profile')
}
exports.resetPassword=function(req,res,next){
    res.render('pages/users/settings-reset-password')
}