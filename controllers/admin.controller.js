//let c= await Address.countDocuments(filter);
const braintree = require("braintree");
var paypal = require('paypal-rest-sdk');
const Subscriber = require('../models/Subscriber');
const dotenv = require('dotenv');
const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BraintreeMerchantId,       //merchant id 
  publicKey: process.env.BraintreePublicKey,        //public key
  privateKey: process.env.BraintreePrivateKey //private key 
});
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PaypalClientId,
  'client_secret': process.env.PaypalClientSecret
});
// paypal.configure({
//   'mode': 'sandbox', //sandbox or live
//   'client_id': 'AaquuDYgEqVLAHr-Iu6CSpJqlQQr7IFFej2VZtVP1MQE7OCof1x4xP-5mL7qMqK5r2BzDEd88f51O8sH',
//   'client_secret': 'EKF17WWFkiFCgraQdUsr5XrzKHPr9J5oA73CB17fpDcOLenDks1fE9IqAvf2lZCRz7Yo_c12iuP3ANMK'
// });
const fs = require('fs');
const path = require('path');
const SellBid = require('../models/SellBid');
const BuyBid = require('../models/BuyBid');
const Attribute = require('../models/Attribute');
const OrderBid = require('../models/OrderBid');
const Product = require('../models/Product');
const Address = require('../models/Address');
const Banner = require('../models/Banner');
var mongoose = require('mongoose');
/*brand controller */
const Brand = require('../models/Brand');
const Category = require('../models/Category');

exports.listBrands=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Brand
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, brand) {
            Brand.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/admin/brand', {
                    brands: brand,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'admin-layout'
                })
            })
        })
  }
  
/* admin can add Brand */
exports.saveBrand=function(req, res, next) {
    var brand = new Brand();
    var imgname='default.jpg';
    brand.name = req.body.brand_name;
    let errors = [];
    if (!req.body.brand_name  ) {
      errors.push({ msg: 'Please enter all Required fields' });
    }  
    if (errors.length > 0) {
      res.render('pages/admin/brands', {
        errors ,
        layout:'admin-layout'
      });
    } else {
       var imgpath=appRoot+'//public//uploads//brands//';
       var mask=777;
       fs.mkdir(imgpath, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') console.log(null); // ignore the error if the folder already exists
            else console.log(err); // something else went wrong
        } else console.log(null); // successfully created folder
    });

    if (!req.files || Object.keys(req.files).length=== 0) {
      return res.status(400).send('No files were uploaded.');
    }else{
      let brandImage1 = req.files.brandImage;
      imgname=Date.now()+path.extname(req.files.brandImage.name);
      brandImage1.mv(imgpath+'//'+imgname, function(err) { 
        if (err) throw err
        console.log(err)
        //return res.status(500).send(err);
        //res.send('File uploaded!');}
      });        
    }

    brand.image = imgname;

    brand.save(function(err,product) {
        if (err){
          throw err
        } else{
             // console.log(product);         
        }      
    });
    req.flash(
      'success_msg',
      'Product Addded Successfully'
    );
    res.redirect('/admin/brand/');
  }
    
}



  /* Admin can update brand */
  exports.updateBrand=function (req, res,next) {
    // var brandId=req.params.id.replace(" ", "");
    var brandId=req.body.brandid;
    var brand = new Brand();
    var imgname='default.jpg';
   
    brand.name = req.body.brand_name;
  
    var imgpath=appRoot+'//public//uploads//brands//';
    var img='';
    var brod={name:req.body.brand_name };
    if (!req.files || Object.keys(req.files).length=== 0) {

    }else{  
      let brandImage1 = req.files.brandImage;
        imgname=Date.now()+path.extname(req.files.brandImage.name);
        brandImage1.mv(imgpath+'//'+imgname, function(err) { 
          if (err) throw err
          //return res.status(500).send(err);
          //res.send('File uploaded!');}
        });  
        brod={name:req.body.brand_name,image:imgname};     
     //console.log(brod);
    }
    Brand.findByIdAndUpdate(brandId, {$set:brod}, function (err, brand) {
            if (err) return next(err);
            res.redirect('/admin/brand/');
        });
      }
      exports.deleteBrand= async function name(req, res, next) {
        var productId=req.params.id;
        const del = await Brand.deleteOne({ _id: productId});
        // `1` if MongoDB deleted a doc, `0` if no docs matched the filter `{ name: ... }`
        del.deletedCount;
        res.redirect('/admin/brand/');
      }
module.saveAttribute=function name(req,res) {
    
}
/******************************************Category crud*************************************** */
exports.listCategory=function(req, res, next) {
  var perPage = 9;
 // var page = req.params.page || 1;
  Category
      .find({})
     //.skip((perPage * page) - perPage)
     // .limit(perPage)
      .exec(function(err, brand) {
          Brand.count().exec(function(err, count) {
              if (err) return next(err)
              res.render('pages/admin/category', {
                  brands: brand,
                 // current: page,
                //  pages: Math.ceil(count / perPage),
                  layout:'admin-layout'
              })
          })
      })
}

/* admin can add Category */
exports.saveCategory=function(req, res, next) {
  var category = new Category();
  
  category.name = req.body.brand_name;

  let errors = [];
  if (!req.body.brand_name  ) {
    errors.push({ msg: 'Please enter all Required fields' });
  }

  if (errors.length > 0) {
    res.render('pages/admin/category', {
      errors ,
      layout:'admin-layout'
    });
  } else {

    category.save(function(err,category) {
      if (err){
        throw err
      }    
  });
  req.flash(
    'success_msg',
    'Product Addded Successfully'
  );
  res.redirect('/admin/category/');
}
  
}

/* Admin can update  Category */
exports.updateCategory=function (req, res,next) {
  var brandId=req.body.brandid;
      brod={name:req.body.brand_name};     
  Category.findByIdAndUpdate(brandId, {$set:brod}, function (err, brand) {
          if (err) return next(err);
          res.redirect('/admin/category/');
      });
    }
    
    exports.deleteCategory= async function name(req, res, next) {
      var productId=req.params.id;   
      const del = await Category.deleteOne({ _id: productId});
      res.redirect('/admin/category/');
    }
exports.productsBuyBids=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1
    var query = {}; 
    Promise.all([
      OrderBid.find({ active:'true' }).populate({path:'product'}),
      BuyBid.find(query).sort({bidprice:-1}),
    ]).then( ([orders,buybids])=>{
      console.log(buybids);
      res.render('pages/admin/buying', {
        buybids: buybids,
        orders:orders,
        pages:1,
        current:1,
        layout:'admin-layout'
      })
        
    })
}
exports.productsSellBids=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
    var query = {}; 
    Promise.all([
      OrderBid.find({ }).populate({path:'product'}),
      SellBid.find(query).sort({bidprice:-1}).limit(10),
    ]).then( ([orders,buybids])=>{
      res.render('pages/admin/selling', {
        buybids: buybids,
        orders:orders,
        pages:1,
        current:1,
        layout:'admin-layout'
      })
        
    })
}

exports.allOrders=function(req, res, next) {
  //console.log(process.env.PaypalClientId);
    var perPage = 9;
    var query = {}; 
    Promise.all([
      OrderBid.find({ }).populate({path:'product'}),
      //.skip((perPage * page) - perPage).limit(perPage),
      SellBid.find(query).sort({bidprice:-1}).limit(10),
    ]).then( ([orders,buybids])=>{
      //console.log(orders[0]);
       var count= orders.length;
      res.render('pages/admin/orders', {
        buybids: buybids,
        orders:orders,
        pages: Math.ceil(count / perPage),
       // current: page,
        layout:'admin-layout'
      })
        
    })
}

// function(req, res, next) {
//     var perPage = 9;
//     var page = req.params.page || 1;
  
//     Myorder
//     .find({})
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
//             res.render('pages/admin/orders', {                  
//                 orders: arr,
//                 order_id:order_id,
//                 payment:payment,
//                 current: page,
//                 pages: Math.ceil(count / perPage),
//                 layout:'admin-layout'
//             })
//             //console.log(orders);
//         })
//     })
//   }
exports.dashboard = function(req, res){
  var usercount=0;
    var productcount=0;
    var query = { user: req.user._id ,status:'buybid'}; 
  Promise.all([
    OrderBid.count(),
    Product.count(),
    BuyBid.count(),
    SellBid.count(),
  ]).then( ([orders,pcount,buybids,sellasks])=>{
    res.render('pages/admin/dashboard', {
      buybids: buybids,
      orders:orders,
      user: req.user,
      pcount:pcount,
      sellasks:sellasks,
      layout:'admin-layout'
    }) 
  })
}
exports.updateOrderStatus =async function (req,res,next) {
  var status =req.body.status.replace(" ","");
  var orderid =req.params.id.replace(" ","");
var order=await OrderBid.findOne({_id:orderid}).populate({path:'sellbid'}).populate({path:'seller'});
 // OrderBid.findByIdAndUpdate(orderid, {status:status}, function (err, order) {
 // var sellercahrges=  order.SellerTransaction.TotalPayout;

  var transactionid=order.payment.transaction.id;
  if(order.status=='canceled'||order.status=='accepeted' || order.status=='canceled_n_charge'){
    res.json({status:'error',message:'Can not Accept/Cancel Order Already canceled '});
  }else{
  if(status=='canceled' ){
    
  //  console.log(status)
  gateway.transaction.find(transactionid, function (err, transaction) {
    if(transaction.status=='submitted_for_settlement'||transaction.status=='settlement_pending'){
      gateway.transaction.void(transactionid, function (err, result) {
        if(result.success==true){
          order.payment= result;
          order.status=status;
          order.save();
          res.json({status:'success',message:'Payment Voided Refund Proccess Initiated '});
        }
         });

    }else{
      gateway.transaction.refund(transactionid, function (err, result) {
        if(result.success==true){
         order.payment= result;
         order.status=status;
          order.save();
          res.json({status:'success',message:'Refund Proccess Initiated '});
        }
     });   
    }
  });
}
else if(status=='cancel_n_charge'){
  var totalcharges = order.sellbid.TotalCharges;
  // console.log(totalcharges);
   var braintreeid=order.seller.braintreeid;
   var cardtoken=order.seller.cardtoken;
   var totalcharges=Math.ceil(55);
    gateway.transaction.sale({
    amount: totalcharges,
     customerId: braintreeid,
     //paymentMethodToken:cardtoken,
     options: {
       submitForSettlement: true
     }
   }, function(error, result) {
       if (result.success==true) {
         console.log('cancel and Charge is processed');
         gateway.transaction.find(transactionid, function (err, transaction) {
           if(transaction.status=='submitted_for_settlement'||transaction.status=='settlement_pending'){
             gateway.transaction.void(transactionid, function (err, result) {
               if(result.success==true){
                 order.payment= result;
                 order.status=status;
                 order.save();
                 res.json({status:'success',message:'Payment Voided Refund Proccess Initiated '});
               }
                });
           }else{
             gateway.transaction.refund(transactionid, function (err, result) {
               if(result.success==true){
                order.payment= result;
                order.status=status;
                 order.save();
                 res.json({status:'success',message:'Refund Proccess Initiated '});
               }
                }); 
           }
       })
       }
     });
 }
else{
  if(order.payment.transaction.status=='voided'){
    res.json({status:'error',message:'Can not Accept Order Already canceled '});
  }else{
  var sender_batch_id = Math.random().toString(36).substring(9);
  var sellerPaypal=order.seller.paypalEmail;
  var bidprice=order.sellbid.bidprice;
  var sellerCharges=order.sellbid.TotalCharges;
  var sellerPayout=bidprice-sellerCharges;
  var sender_item_id=order.product._id;
 
      var create_payout_json = {
          "sender_batch_header": {
              "sender_batch_id": sender_batch_id,
              "email_subject": "You have a payment"
          },
          "items": [
              {
                  "recipient_type": "EMAIL",
                  "amount": {
                      "value": sellerPayout,
                      "currency": "USD"
                  },
                  "receiver": sellerPaypal,
                  "note": "Thank you.",
                  "sender_item_id": sender_item_id
              }
          ]
      };
      var sync_mode = 'false';
        paypal.payout.create(create_payout_json, sync_mode, function (error, payout) {
            if (error) {
                //console.log(error.response);
                throw error;
            } else {
              order.status=status;
              var payoutId = payout.batch_header.payout_batch_id;//"R3LFR867ESVQY";
                     paypal.payout.get(payoutId, function (error, payout1) {
                         if (error) {
                             console.log(error);
                             throw error;
                         } else {
                           order.sellerPayout=payout1;
                             //console.log("Get Payout Response");
                             console.log(payout1);
                            // console.log(payout1.items[0].payout_item_id);
                            // console.log(payout1.items[0].payout_item_fee);
                            // console.log(payout1.items[0].payout_item);
                             var payoutItemId =payout1.items[0].payout_item_id;
                             }
                             order.save();
                     });
                res.json({status:'success',message:'Order Accepted and Payout Send to Seller'});
            }
        });
    }
  }
}   
}
exports.viewTransaction = function (req,res,next) {
  var query = {};
  Promise.all([
    OrderBid.find({ }).populate({path:'product'}).populate({path:'sellbid'}),
    SellBid.find(query).sort({bidprice:-1}),
  ]).then( ([orders,buybids])=>{
     var count= orders.length;
     //console.log(orders);
    res.render('pages/admin/transaction', {
      buybids: buybids,
      orders:orders,
      layout:'admin-layout'
    })         
  })     
}
exports.transactionStatus = async function (req,res,next)
{
  var orderid =req.body.orderid.replace(" ","");
  var order=await OrderBid.findOne({_id:orderid});
  var transactionid=order.payment.transaction.id;
  gateway.transaction.find(transactionid, function (err, transaction) {
    order.payment= {transaction:transaction};
    order.save();
  res.json({status:"success",data:{},message:'fsadfasfd'})
  });
}


exports.orderDetail =async function (req,res,next) {
  var orderid =req.params.id.replace(" ","");
var order=await OrderBid.findOne({_id:orderid}).populate({path:'sellbid'}).populate({path:'buybid'}).populate({path:'seller'}).populate({path:'product'});  
var seller=order.seller;
var buyer = order.buyer;
//console.log('seller'+seller)
var sellerinfo= await Address.findOne({user:seller, address_type:'seller'}); 
// var buyerinfo = await Address.findOne({user:buyer,address_type:'buyer'});
// console.log(buyerinfo);
// console.log(order);
 //console.log('sellerinfo');
 console.log(sellerinfo.organisation_name);
// console.log('----------------------shipping------------------');
//console.log(order.buybid);
  if(order){
    res.render('pages/admin/order-detail', {
      order:order,
      sellerinfo:sellerinfo,
      layout:'admin-layout'
    })
  }
         
}
exports.statusWebhook = function (req, res) {
  gateway.webhookNotification.parse(
    req.body.bt_signature,
    req.body.bt_payload,
    function (err, webhookNotification) {
     // console.log("[Webhook Received " + webhookNotification.timestamp + "] | Kind: " + webhookNotification.kind);

      // Example values for webhook notification properties
     // console.log(webhookNotification.kind); // "subscriptionWentPastDue"
    //  console.log(webhookNotification.timestamp); // Sun Jan 1 00:00:00 UTC 2012
    }
  );
  res.status(200).send();
}
exports.viewBanner = function (req, res){
  Banner.find({}).exec(function(err, banner) {
                if (err) return next(err)
                // res.json({status:'success',data:{
                //   banner: banner},message:''})
                res.render('pages/admin/banner', {
                    banner: banner,
                    layout:'admin-layout'
        })
      })
 }
 exports.addBanner = function(req,res){
  var banner = new Banner();
  var imgname='default.jpg';
  banner.url = req.body.banner_url;
  banner.status = req.body.banner_status;
   var img='';
  var imgpath=appRoot+'//public//uploads//banner//';
       var mask=777;
       fs.mkdir(imgpath, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') console.log(null); // ignore the error if the folder already exists
            else console.log(err); // something else went wrong
        } else console.log(null); // successfully created folder
    });
  var brod={url:req.body.banner_url };
  if (!req.files || Object.keys(req.files).length=== 0) {

  }else{  
    let banner_image = req.files.banner_image;
      imgname=Date.now()+path.extname(req.files.banner_image.name);
      banner_image.mv(imgpath+'//'+imgname, function(err) { 
        if (err) throw err
      });  
      banner.image = imgname;   
      banner.save(function(err,banner) {
        if (err){
          throw err
        } else{
             // console.log(product);         
        }      
    });
    req.flash(
      'success_msg',
      'banner Uploaded Successfully'
    );
         res.redirect('/admin/banner'); 

 }
}
exports.updateBanner = function (req,res,next) {
  var url = req.body.banner_url ;
  
  var bannerId=req.body.bannerid;
    var banner = new Banner();
    var imgname='default.jpg';
    var imgpath=appRoot+'//public//uploads//banner//';
    var img='';
    var brod={name:req.body.banner_url };
    if (!req.files || Object.keys(req.files).length=== 0) {

    }else{  
      let bannerImage = req.files.banner_image;
        imgname=Date.now()+path.extname(req.files.banner_image.name);
        bannerImage.mv(imgpath+'//'+imgname, function(err) { 
          if (err) throw err
        });  
        brod={url:req.body.banner_url,image:imgname};     
}
Banner.findByIdAndUpdate(bannerId, {$set:brod}, function (err, banner) {
  if (err) return next(err);
  res.redirect('/admin/banner/');
});
}

exports.updateBannerStatus = function(req,res,next){
 var bannerId = req.body.uid ;
  var status = req.body.status;
  //console.log(status);
  //console.log(bannerId);
  var prod = {status : status};
  Banner.findByIdAndUpdate(bannerId, {$set:prod}, function (err, banner) {
      if (err) return next(err);
      res.json({status:'success',data:{banner:banner},message:'Banner Action success'});
  });
}
// exports.deleteBanner= async function (req, res, next) {
//   var bannerId=req.body.uid;
//   console.log(bannerId);
//    Banner.deleteOne({ _id: bannerId}, function (err, banner) {
//      if(err) return next(err);
//      res.redirect('/admin/banner');
//    });
  
// }
exports.deleteBanner= function name(req, res, next) {
  var bannerId=req.body.uid;
  Banner.deleteOne({ _id: bannerId}, function (err, banner) {
  res.json({status:'success', data:{},message:'Banner Deleted Success'});
})
}


exports.subscribe_email = function name(req, res, next)
{

  var subscriber = new Subscriber();
  subscriber.email = req.body.subscribe_email;

  if (!subscriber.email){
    res.json({status:'error', data:'', msg: 'Please Input a valid Email'});
  }
   else if(subscriber.email){
    Subscriber.findOne({ email: subscriber.email }).then(user => {
      if (user) {
        res.json({status:'error', data:{}, msg: 'You Have already Subscribed'});
      } 
    });
   } else {
  subscriber.save(function(err,user) {
      if (err){
        throw err
      }
  });
 
//   res.redirect('/');
 }
 res.json({status:'success', data:{}, msg: 'Thank You for Subscribe Our New latter'});
}


exports.subscriber_list = function name(req, res, next)
{
  
  Subscriber.find({}).exec(function(err, subscriber) {
 
    if (err) return next(err)
    //subscribers.push(subscriber);
   //console.log(subscriber.length);
    res.render('pages/admin/subscribe', {
      subscriber: subscriber,
      layout:'admin-layout'
})
});

}

exports.charge_env = function name(req,res,next){
  const fs = require('fs')


 const dotenv = require('dotenv')
  var envConfig = dotenv.parse(fs.readFileSync('.env'));
 // console.log(envConfig);

//   var  Times =  process.env.TIMES ;
// data.push(Times);
// var node_env = process.env.NODE_ENV ;
// data.push(node_env);
// var port = process.env.PORT;
// data.push(port);
// //Set your database/API connection information here
// var database_key = process.env.DBKEY;
// data.push(database_key);
// var database = process.env.DBUSER;
// data.push(database);
// var database_host = process.env.DBHOST;
// data.push(database_host);
// var database_name = process.env.DBNAME;
// data.push(database_name);
// var stripe_publishable_key = process.env.STRIPE_PUBLISHABLE_KEY;
// data.push(stripe_publishable_key);
// var stripe_secret_key = process.env.STRIPE_SECRET_KEY;
// data.push(stripe_secret_key);
// var braintree_id = process.env.BraintreeMerchantId;
// data.push(braintree_id)
// var braintree_public_key = process.env.BraintreePublicKey;
// data.push(braintree_public_key);
// var braintree_private_key = process.env.BraintreePrivateKey;
// data.push(braintree_private_key);
// var paypal_client_id = process.env.PaypalClientId;
// data.push(paypal_client_id);
// var paypal_client_secret = process.env.PaypalClientSecret;
// data.push(paypal_client_secret);
// var buyprocess_fee = process.env.BuyProcessingFee;
// data.push(buyprocess_fee);
// var buy_shipping = process.env.BuyShipping;
// data.push(buy_shipping);
// var buy_auth_fee = process.env.BuyAuthenticationFee;
// data.push(buy_auth_fee);
// var transaction_fee = process.env.TransactionFeeCharge;
// data.push(transaction_fee);
// var sell_process = process.env.SellProcessingCharge;
// data.push(sell_process);
// var sell_shipping = process.env.SellShipping;
// data.push(sell_shipping);
//console.log(data);

res.render('pages/admin/env_view', {
data:envConfig,
// data:data,
  layout:'admin-layout'
})

//res.render({status:'success', data:{data:data},message:''});
}