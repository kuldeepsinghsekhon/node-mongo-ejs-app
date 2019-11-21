const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const User = require('../models/User');
const Myorder = require('../models/Myorder');
const Cart = require('../models/Mycart');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { permit } = require('../config/role-auth');
const fileUpload = require('express-fileupload');

const app = express();
app.use(fileUpload());
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb+srv://aquatec:'+encodeURIComponent('YDbEIGdQUcG2qcG0')+'@cluster0-frznk.mongodb.net/test?retryWrites=true&w=majority';


// Admin tool to directly run queries on database
router.get('/query-tool',function(req,res,next){
  MongoClient.connect(url, function(err, client) {
    if(err) {
      console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
 }
 console.log('Connected...');
 var db=client.db("test");

 const collection = db.collection("products");
//db.command();
  collection.find({}).toArray(function(err, docs) {
    console.log("Found the following records");
    console.log(docs)
    
  });
}); 
  res.render('pages/admin/query-tool',{layout:'admin-layout'})});
router.post('/query-tool',function(req,res,next){
  //  var obj =  Product.find({}).exec(function(err, products) {
  //   res.send(products);
  //  });

  res.send(obj);  
});
router.get('/dashboard', ensureAuthenticated,permit('Admin'), function(req, res){
  var usercount=User.count().exec();
  var productcount=Product.count().exec();
  res.render('dashboard', {
    usercount:usercount,
    productcount:productcount,
    user: req.user
  })
});
router.get('/', ensureAuthenticated,permit('Admin'),

function(req, res){
  var usercount=0;
    var productcount=0;
    productcount=Product.countDocuments();
    

  res.render('pages/admin/dashboard', {
   
    layout:'admin-layout',
    usercount:usercount,
    pcount:Product.countDocuments(),
    user: req.user
  })
});

// (req, res) => res.render('pages/admin/dashboard',{ layout:'admin-layout' }));
 router.get('/add-product', function(req, res, next) {
    res.render('pages/admin/add-product',{layout:'admin-layout'}); 
 });

router.get('/product/:id/edit', function(req, res, next) {
  var productId=req.params.id;
      product=Product.findById(productId,function(err,product){
      // if(err){
      //     return res.redirect('/');
      // }
          res.render('pages/admin/edit-product', {
            product: product,
            layout:'admin-layout'
        })
    })
});

router.post('/product/:id/update',ensureAuthenticated, permit('Admin'),function (req, res,next) {
  var productId=req.params.id.replace(" ", "");
  var product = new Product();
  var imgname='default.jpg';
  product.category = req.body.category_name;
  product.description = req.body.product_description;
  product.name = req.body.product_name;
  product.sku = req.body.product_sku;
  product.price = req.body.product_price;
  var imgpath=appRoot+'//public//uploads//products//';
  var img='';
  var prod={name:req.body.product_name, description:req.body.product_description,category:req.body.category_name,sku:req.body.product_sku,price:req.body.product_price,style: req.body.style };
  if (!req.files || Object.keys(req.files).length=== 0) {
    //console.log('No files were uploaded.');
  }else{  
    let productImage1 = req.files.productImage;
      imgname=Date.now()+path.extname(req.files.productImage.name);
      productImage1.mv(imgpath+'//'+imgname, function(err) { 
        if (err) throw err
        //return res.status(500).send(err);
        //res.send('File uploaded!');}
      });  
      prod={name:req.body.product_name,description:req.body.product_description,category:req.body.category_name,sku:req.body.product_sku,price:req.body.product_price,style: req.body.style,image:imgname };     
   // console.log(img);
  }
  Product.findByIdAndUpdate(productId, {$set:prod}, function (err, product) {
          if (err) return next(err);
          res.redirect('/admin/template-products/1');
      });
    });
 
router.post('/add-product',ensureAuthenticated, permit('Admin'),function(req, res, next) {
    var product = new Product();
    var imgname='default.jpg';
    product.category = req.body.category_name;
    product.description = req.body.product_description;
    product.name = req.body.product_name;
    product.sku = req.body.product_sku;
    product.price = req.body.product_price; 
    product.style = req.body.style; 
    let errors = [];
    if (!req.body.category_name || !req.body.product_description || !req.body.product_name || !req.body.product_sku
      || !req.body.product_price || !req.body.style ) {
      errors.push({ msg: 'Please enter all Required fields' });
    }
  
    // if (password != password2) {
    //   errors.push({ msg: 'Passwords do not match' });
    // }
  
    if (errors.length > 0) {
      res.render('pages/admin/add-product', {
        errors ,
        layout:'admin-layout'
      });
    } else {
  
    var imgpath=appRoot+'//public//uploads//products//';
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
      let productImage1 = req.files.productImage;
      imgname=Date.now()+path.extname(req.files.productImage.name);
      productImage1.mv(imgpath+'//'+imgname, function(err) { 
        if (err) throw err
        //return res.status(500).send(err);
        //res.send('File uploaded!');}
      });        
    }

    product.image = imgname;

    product.save(function(err,product) {
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
    res.redirect('/admin/add-product');
  }
    
});


//router.get('/admin/', ensureAuthenticated, (req, res) => res.render('pages/admin/dashboard',{ layout:'admin-layout' }));
//router.get('/admin/users', ensureAuthenticated, (req, res) => res.render('pages/admin/users',{ layout:'admin-layout' }));
//router.get('/admin/template-products', ensureAuthenticated, (req, res) => res.render('pages/admin/template-products',{ layout:'admin-layout' }));
router.get('/template-products/:page',ensureAuthenticated, permit('Admin'), function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Product
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, products) {
            Product.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/admin/template-products', {
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'admin-layout'
                })
            })
        })
  });
  router.get('/users/:page',ensureAuthenticated, permit('Admin'), function(req, res, next) {
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
  });
  router.get('/orders/:page',ensureAuthenticated, permit('Admin'), function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Myorder
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, orders) {
        Myorder.count().exec(function(err, count) {
            if (err) return next(err)
            var arr = [];
            var order_id = [];
            var payment = [];
            orders.forEach(order => {                 
                var cart= new Cart(order.cart);
            var products =cart.generateArray();
            arr.push(products); 
            order_id.push(order.id);
            payment.push(order.payment)
              }); 
            res.render('pages/admin/orders', {                  
                orders: arr,
                order_id:order_id,
                payment:payment,
                current: page,
                pages: Math.ceil(count / perPage),
                layout:'admin-layout'
            })
            //console.log(orders);
        })
    })
  });
module.exports = router;