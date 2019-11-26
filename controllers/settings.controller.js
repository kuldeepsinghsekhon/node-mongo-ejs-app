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
        .findOne({user:req.user,address_type:'billing'})
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
  exports.saveBuyerInfo=async function(req,res){
    const update={name:'kuldeep',country:'india',state:'punjab',city:'Amritsar',locality:'New sant',thoroughfare:'G.T Road',premise:'A1',phone:'9803242155'
              ,user:req.user,address_type:'billing'};
    const  filter={user:req.user,address_type:'billing'};
   let c= await Address.countDocuments(filter);
   console.log(c);
   let address=await  Address.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true // Make this update into an upsert
      });
      console.log(address);
    // const doc = Address.findOne().exec(
    //     function(err,address){
    //         if(address){
    //             address.name='dfdsf';
    //             console.log('Address find');
    //             console.log(address);
    //             address.save();
    //            // Address.updateOne(req.body);
    //         }else{
    //             console.log('not found');
    //            var address= Address.create(update);
  
    //          console.log(address);
    //         }
      //  }
        
    //);
    //   Address.findByIdAndUpdate(productId, {$set:prod}, function (err, product) {
    //     if (err) return next(err);
    //     res.redirect('/admin/template-products/1');
    // });
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