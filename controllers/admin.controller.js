//let c= await Address.countDocuments(filter);

const SellBid = require('../models/SellBid');
const BuyBid = require('../models/BuyBid');
const Attribute = require('../models/Attribute');
const OrderBid = require('../models/OrderBid');
/*brand controller */
const Brand = require('../models/Brand');
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
module.saveAttribute=function name(req,res) {
    
}
exports.productsBuyBids=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
    //console.log(req.user._id);
   
    var query = {}; 
    Promise.all([
      OrderBid.find({  }).populate({path:'product'}),
      BuyBid.find(query).sort({bidprice:-1}).limit(10),
    ]).then( ([orders,buybids])=>{
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
    //console.log(req.user._id);
   
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
    var perPage = 9;
    var page = req.params.page || 1;
    //console.log(req.user._id);
   
    var query = {}; 
    Promise.all([
      OrderBid.find({ }).populate({path:'product'}).skip((perPage * page) - perPage).limit(perPage),
      SellBid.find(query).sort({bidprice:-1}).limit(10),
    ]).then( ([orders,buybids])=>{
       var count= orders.length;
        console.log(orders);
      res.render('pages/admin/orders', {
        buybids: buybids,
        orders:orders,
        pages: Math.ceil(count / perPage),
        current: page,
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