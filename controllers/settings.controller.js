const Address = require('../models/Address');
const User = require('../models/User');
const Myorder = require('../models/Myorder');
const Cart = require('../models/Mycart');
const SellBid = require('../models/SellBid');
const BuyBid = require('../models/BuyBid');
const Category = require('../models/Category');
const UserNotification = require('../models/UserNotification');
const utils_controller = require('../controllers/utils.controller');


const OrderBid = require('../models/OrderBid');

exports.settings=function(req, res, next) {

    User
        .findOne({_id:req.user._id})
        .populate({path:'notifications'})
        .exec(function(err, user) {
          User.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/users/setting', {
                    user: user,
                    layout:'layout'
                })
            })
           // console.log(user)
        })
  }
  exports.buyerInfo=function(req, res, next) {
    Address
        .findOne({user:req.user,address_type:'billing'})
        .exec(function(err, address) {
            Address.count().exec(function(err, count) {
                if (err) return next(err)
                if(address==null)address=new Address();
                res.render('pages/users/settings-buyer-info', {
                  address: address,

                    layout:'layout'
                })
            })
        })
  }
  exports.saveBuyerInfo=async function(req,res){
   
    const user=req.user;
    let address_type='billing';
    const { name, lastname, country,address1,address2, state, city,postalCode,phone} = req.body;
    let errors = [];
  
   if (!name || !country || !state || !city||!address1||!phone||!postalCode) {
     errors.push({ msg: 'Please enter all fields' });
   }
   if (name.length < 6) {
    errors.push({ msg: 'name must be at least 6 characters' });
  }
   if (country.length < 2) {
     errors.push({ msg: 'country must be at least 6 characters' });
   }
   if (state.length < 3) {
    errors.push({ msg: 'state must be at least 3 characters' });
  }
  if (city.length < 3) {
    errors.push({ msg: 'city must be at least 3 characters' });
  }
  if (address1.length < 3) {
    errors.push({ msg: 'address1 must be at least 3 characters' });
  }
  
  if (phone.length < 10) {
    errors.push({ msg: 'phone must be at least 10 characters' });
  }
    const update={name,lastname,country,state,city,address1,address2,phone,user,address_type,postalCode};
    const  filter={user:user,address_type:address_type};
   
  // console.log(c);
   if (errors.length > 0) {
       console.log(errors);
       //res.redirect('/user/setting');
       res.json({success:false,errors:errors});
  } else {
   let address=await  Address.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true // Make this update into an upsert
      });
      res.json({success:true,address:address});
     // res.redirect('/user/setting');
     // console.log(address);
      }
  }
    exports.sellerInfo=function(req, res, next) {
      var perPage = 9;
      var page = req.params.page || 1;
    
      Address
          .find({})
          .exec(function(err, users) {
              Address.count().exec(function(err, count) {
                  if (err) return next(err)
                  if(address==null)address=new Address();
                  res.render('pages/users/settings-seller-info', {
                      users: users,
                      current: page,
                      pages: Math.ceil(count / perPage),
                      layout:'layout'
                  })
              })
          }) 

  }
    
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
 // }
  exports.shippingInfo=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
    let address_type='shipping';
    Address
        .findOne({user:req.user, address_type:address_type})
        .exec(function(err, address) {
            Address.count().exec(function(err, count) {
                if (err) return next(err)
                //console.log(address);
                if(address==null)address=new Address();
                res.render('pages/users/settings-shipping-info', {
                  address: address,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  }
  exports.saveShippingInfo=async function(req,res,next){
    const user=req.user;
  let address_type='shipping';
  const { name, lastname, country,address1,address2, state, city,postalCode,phone} = req.body;
  let errors = [];

 if (!name || !country || !state || !city||!address1||!phone||!postalCode) {
   errors.push({ msg: 'Please enter all fields' });
 }
 if (name.length < 6) {
  errors.push({ msg: 'name must be at least 6 characters' });
}
 if (country.length < 2) {
   errors.push({ msg: 'country must be at least 6 characters' });
 }
 if (state.length < 3) {
  errors.push({ msg: 'state must be at least 3 characters' });
}
if (city.length < 3) {
  errors.push({ msg: 'city must be at least 3 characters' });
}
if (address1.length < 3) {
  errors.push({ msg: 'address1 must be at least 3 characters' });
}

if (phone.length < 10) {
  errors.push({ msg: 'phone must be at least 10 characters' });
}
  const update={name,lastname,country,state,city,address1,address2,phone,user,address_type,postalCode};
  const  filter={user:user,address_type:address_type};
 
// console.log(c);
 if (errors.length > 0) {
     console.log(errors);
     //res.redirect('/user/setting');
     res.json({success:false,errors:errors});
} else {
 let address=await  Address.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true // Make this update into an upsert
    });
    res.json({success:true,address:address});
   // res.redirect('/user/setting');
   // console.log(address);
    }
}
  exports.sellerInfo=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
    let address_type='seller';
    Address
        .findOne({user:req.user, address_type:address_type})
        .exec(function(err, address) {
            Address.count().exec(function(err, count) {
                if (err) return next(err)
                if(address==null)address=new Address();
                res.render('pages/users/settings-seller-info', {
                  address: address,
                    layout:'layout'
                })
            })
        })
  }
 
    exports.saveSellerInfo=async function(req,res){
        const user=req.user;
      let address_type='seller';
      const { name,organisation_name, country,address1,address2, state, city,postalCode,phone} = req.body;
      let errors = [];
   
     if (!name || !organisation_name||!country || !state || !city||!address1||!phone||!postalCode||!phone) {
       errors.push({ msg: 'Please enter all fields' });
     }
     if (name.length < 6) {
      errors.push({ msg: 'name must be at least 6 characters' });
    }
    if (organisation_name.length < 3) {
        errors.push({ msg: 'organisation name must be at least 3 characters' });
      }
     if (country.length < 2) {
       errors.push({ msg: 'country must be at least 6 characters' });
     }
     if (state.length < 3) {
      errors.push({ msg: 'state must be at least 3 characters' });
    }
    if (city.length < 3) {
      errors.push({ msg: 'city must be at least 3 characters' });
    }
    if (address1.length < 3) {
      errors.push({ msg: 'address1 must be at least 3 characters' });
    }
  
    if (phone.length < 10) {
      errors.push({ msg: 'phone must be at least 10 characters' });
    }
      const update={name,organisation_name,country,state,city,address1,address2,phone,user,address_type,postalCode};
      const  filter={user:user,address_type:address_type};
     
    // console.log(c);
     if (errors.length > 0) {
         console.log(errors);
      res.render('pages/users/settings-seller-info', {
        errors,
        name, country,address1,address2, state, city,postalCode,phone
      });
    } else {
      let  address=[];
   address=await  Address.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true // Make this update into an upsert
        });
        res.json({success:true,address:address});
        // req.flash(
        //   'success_msg',
        //   'Seller info saved successfully'
        // );
        // res.redirect('/user/setting');
        // console.log(address);
  
    }
}
  exports.payoutInfo=function(req,res,next){
    User.findOne({_id:req.user._id})
      .exec(function(err, user) {
          User.count().exec(function(err, count) {
              if (err) return next(err)
              //if(address==null)address=new Address();
              res.render('pages/users/settings-payout-info', {
                  user: user,                        
                  layout:'layout'
              })
          })
      })

  }
  exports.savePayoutInfo=function(req,res,next) {
    const user_id=req.user._id;
   //console.log(user_id);
    const prod={paypalEmail:req.body.paypalEmail};    
    User.findByIdAndUpdate(user_id, {$set:prod},{new: true}, function (err, user) {
     // console.log(user);
          if (err) {
            res.status(200).json({status:"error",message:"failed to update"})
          }else{
            res.status(200).json({status:"ok",message:"paypal email updated successfully", paypalEmail: user.paypalEmail})
          }    
    });
  }
  exports.saveProfile=function(req,res,next) {
    const user_id=req.user._id;
    var shoessize = req.body.shoesize;
    var selectedCurrency= req.body.selectedCurrency;
    const prod={email:req.body.email,name:req.body.name,username:req.body.username,shoessize: req.body.shoesize,selectedCurrency:req.body.selectedCurrency};    
    User.findByIdAndUpdate(user_id, {$set:prod},{new: true}, function (err, user) {
      //console.log(user);
          // if (err) {
          //   res.status(200).json({status:"error",message:"failed to update"})
          // }else{
          //   res.status(200).json({status:"ok",message:"Profile Data updated successfully", email: user.email  })
          // } 
          res.status(200).json({status:"success",data:{},message:"Profile updated successfully"})
   
         // res.json({success:true});
    });
  }
  
  exports.editProfile=function(req,res,next){
    
    Country.find()
      .exec(function(err, countries) {
        Country.count().exec(function(err, count) {
              if (err) return next(err)
              res.render('pages/users/settings-profile', {
                  user: req.user, 
                  countries:countries,                       
                  layout:'layout'
              })
          })
      })
   // res.render('pages/users/settings-profile')
}

exports.requestResetPassword=function(req,res,next){
  var portal=req.body.portal;
  const user_id=req.user._id;
  const email=req.user.email;
  const token=Math.ceil(Math.random() * 1000000);
  var mailOptions = {
    from: 'aquatecinnovative1@gmail.com',
    to: email,
    subject: 'Reset Password',
    html: 'Please Validate Your OTP on Given link. Your OTP is ' + token + 
    '</br>  for Reset Password <a href="https://aquatecinnovative.herokuapp.com/change_password?t='+token+'&id='+user_id+'">Click Here</a>',
  };
   utils_controller.sendmymail(mailOptions);
    User.findOneAndUpdate({_id:user_id},{token:token})
    .exec(function(err, user) {
        User.count().exec(function(err, count) {
            if (err) return next(err)
            if(portal=='app'){
              res.json({status:"success",data:{},message:'reset password mail sent Successfully'})
            }else{
              res.render('pages/users/settings-reset-password', {
                user: user,                        
                layout:'layout'            }) 
            }         
        })
    })    
  }


exports.followingProducts=function(req, res, next) {
  var perPage = 9;
  var page = req.params.page || 1;

  User
      .find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, users) {
          User.count().exec(function(err, count) {
              if (err) return next(err)
              res.render('pages/users/following', {
                  users: users,
                  current: page,
                  pages: Math.ceil(count / perPage),
                  layout:'layout'
              })
          })
      })
}

exports.productsPortfolio=function(req, res, next) {
  var perPage = 9;
  var page = req.params.page || 1;

  User.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, users) {
          User.count().exec(function(err, count) {
              if (err) return next(err)
              res.render('pages/users/portfolio', {
                  users: users,
                  current: page,
                  pages: Math.ceil(count / perPage),
                  layout:'layout'
              })
          })
      })
}
exports.productsBuying=function(req, res, next) {
  var perPage = 9;
  var page = req.params.page || 1;
  //console.log(req.user._id);
  //var query = { user: req.user._id };
  var query = { user: req.user._id ,status:'buybid'}; 
  Promise.all([
    OrderBid.find({ buyer: req.user._id,status:{$in: ['Won Bid', 'Order Placed']} }).populate({path:'product'}),
    BuyBid.find(query).sort({bidprice:-1}).limit(10), 
    OrderBid.find({ buyer: req.user._id,status:{$in: ['accepeted', 'canceled']} }).populate({path:'product'}),
    Category.find(),
  ]).then( ([orders,buybids,history,category])=>{
   // console.log(historyorders);
   // console.log(req.user);
    res.render('pages/users/buying', {
      buybids: buybids,
      orders:orders,
      category:category,
      history:history,
      layout:'layout'
    })
      
  })
  // Myorder
  //     .find(query)
  //     .skip((perPage * page) - perPage)
  //     .limit(perPage)
  //     .exec(function(err, orders) {
  //         Myorder.count().exec(function(err, count) {
  //             if (err) return next(err)
  //             var arr = [];
  //             var order_id = [];
  //             var payment = [];
  //             orders.forEach(order => {                 
  //                 var cart= new Cart(order.cart);
  //             var products =cart.generateArray();
  //             arr.push(products);
  //             order_id.push(order.id);
  //             payment.push(order.payment)
  //               }); 
  //             res.render('pages/users/buying',{                  
  //                 orders: arr,
  //                 order_id:order_id,
  //                 payment:payment,
  //                 current: page,
  //                 pages: Math.ceil(count / perPage),
  //                 layout:'layout'
  //             })
  //             //console.log(orders);
  //         })
  //     })

}


exports.productsSelling=function(req, res, next) {
  var perPage = 9;
  var page = req.params.page || 1;
  //console.log(req.user._id);
  var query = { user: req.user._id ,status:'ask'}; 
  Promise.all([
    OrderBid.find({ seller: req.user,status:{$in: ['Won Bid', 'Order Placed']}}).populate({path:'product'}),
    SellBid.find(query).sort({bidprice:-1}).limit(10),
    OrderBid.find({ seller: req.user._id,status:{$in: ['accepeted', 'canceled']} }).populate({path:'product'}),
    
  ]).then( ([orders,askbids,history])=>{
    //console.log('history')
   // console.log(history[0].product.name)
    res.render('pages/users/selling', {
      askbids: askbids,
      orders:orders,
      layout:'layout',
      history:history
    })
      
  })
      //   SellBid
      //   .find(query).populate('productid')
      // .skip((perPage * page) - perPage)
      // .limit(perPage)
      // .exec(function(err, askbids) {
      //   SellBid.count().exec(function(err, count) {
      //         if (err) return next(err)
      //         res.render('pages/users/selling', {
      //           askbids: askbids,
      //             current: page,
      //             pages: Math.ceil(count / perPage),
      //             layout:'layout'
      //         })
      //     })
      //     console.log(askbids);
      // })
}
exports.saveNoficationSetting=async function(req,res,next) {
  const user=req.user;
  let key='notif'+req.params.id;
  const enabled=req.body.enabled;
  
     var cuser=await User.findOne({_id:user._id}).populate({path:'notifications'});
     var notification= await UserNotification.findOne({user})
    // BuyBid.find(query).sort({bidprice:-1}).limit(10),
 //console.log(cuser);
 if(notification){
  UserNotification.create
 }
    if(key=='notif1'){
      notification.notif1=enabled;
    }else if(key=='notif2'){
      notification.notif2=enabled;
    }else if(key=='notif3'){
      notification.notif3=enabled;
    }
    cuser.notifications=notification;
    //console.log(cuser);
    cuser.save();
    notification.save();    
    res.status(200)

  var mailOptions = {
    from: 'aquatecinnovative1@gmail.com',
    to: user.email,
    subject: key+' Notification '+req.body.enabled,
    text: key+' Notification '+req.body.enabled + 'successfully'
  };
  //utils_controller.sendmymail(mailOptions);
}
 //console.log(user_id);
// const doc = UserNotification.findOne({user,notificationId}).exec(
//         function(err,notification){
//             if(notification){
//               if(key=='email'){
//                 notification.email=enabled;
//               }else if(key=='sms'){
//                 notification.sms=enabled;
//               }else if(key=='push'){
//                 notification.push=enabled;
//               }
//               res.status(200).json({status:"ok",message:"Notification setting updated successfully", notification: notification})

//                 console.log('Address find');
//                 console.log(notification);
//                 notification.save();
//                // Address.updateOne(req.body);
//             }else{
//                 console.log('not found');
//                var notification= UserNotification.create({notificationId:1, key:1,sms:1,push:1, user:user});
//                res.status(200).json({status:"ok",message:"Notification setting added successfully", notification: notification})

//              console.log(notification);
//             }
//             //mail send
           
//             console.log(key);
//             console.log(enabled);
//            // utils_controller.sendmymail(mailOptions);
//        });

 
//}
