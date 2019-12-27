//let c= await Address.countDocuments(filter);
const fs = require('fs');
const path = require('path');
const SellBid = require('../models/SellBid');
const BuyBid = require('../models/BuyBid');
const Attribute = require('../models/Attribute');
const OrderBid = require('../models/OrderBid');
const Product = require('../models/Product');

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
  
    // if (password != password2) {
    //   errors.push({ msg: 'Passwords do not match' });
    // }
  
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
    res.redirect('/admin/brand/1');
  }
    
}



  /* Admin can update brand */
  exports.updateBrand=function (req, res,next) {
      console.log(req.body);
      console.log('hello');
    // var brandId=req.params.id.replace(" ", "");
    var brandId=req.body.brandid;
    var brand = new Brand();
    var imgname='default.jpg';
   
    brand.name = req.body.brand_name;
  
    var imgpath=appRoot+'//public//uploads//brands//';
    var img='';
    var brod={name:req.body.brand_name };
    if (!req.files || Object.keys(req.files).length=== 0) {
      //console.log('No files were uploaded.');
    }else{  
      let brandImage1 = req.files.brandImage;
        imgname=Date.now()+path.extname(req.files.brandImage.name);
        console.log(imgname);
        brandImage1.mv(imgpath+'//'+imgname, function(err) { 
          if (err) throw err
          //return res.status(500).send(err);
          //res.send('File uploaded!');}
        });  
        brod={name:req.body.brand_name,image:imgname};     
     console.log(brod);
    }
    Brand.findByIdAndUpdate(brandId, {$set:brod}, function (err, brand) {
            if (err) return next(err);
            res.redirect('/admin/brand/1');
        });
      }
      exports.deleteBrand= async function name(req, res, next) {
        var productId=req.params.id;
        console.log(productId);
        const del = await Brand.deleteOne({ _id: productId});
        // `1` if MongoDB deleted a doc, `0` if no docs matched the filter `{ name: ... }`
        del.deletedCount;
        res.redirect('/admin/brand/1');
      }
module.saveAttribute=function name(req,res) {
    
}
/******************************************Category crud*************************************** */
exports.listCategory=function(req, res, next) {
  var perPage = 9;
  var page = req.params.page || 1;
  Category
      .find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, brand) {
          Brand.count().exec(function(err, count) {
              if (err) return next(err)
              res.render('pages/admin/category', {
                  brands: brand,
                  current: page,
                  pages: Math.ceil(count / perPage),
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
      } else{
           // console.log(product);         
      }      
  });
  req.flash(
    'success_msg',
    'Product Addded Successfully'
  );
  res.redirect('/admin/category/1');
}
  
}

/* Admin can update  Category */
exports.updateCategory=function (req, res,next) {
    console.log(req.body);
  var brandId=req.body.brandid;
  var brand = new Category();

  brand.name = req.body.brand_name;

      brod={name:req.body.brand_name};     

  Brand.findByIdAndUpdate(brandId, {$set:brod}, function (err, brand) {
          if (err) return next(err);
          res.redirect('/admin/brand/1');
      });
    }
    exports.deleteCategory= async function name(req, res, next) {
      var productId=req.params.id;   
      const del = await Category.deleteOne({ _id: productId});
      console.log( del.deletedCount);
      res.redirect('/admin/category/1');
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