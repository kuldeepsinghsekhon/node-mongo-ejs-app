const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const fileUpload = require('express-fileupload');
const app = express();
app.use(fileUpload());

router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);
router.get('/', ensureAuthenticated, (req, res) => res.render('pages/admin/dashboard',{ layout:'admin-layout' }));
router.get('/add-product', function(req, res, next) {
    res.render('pages/admin/add-product',{layout:'admin-layout'}); 
});

router.post('/add-product', function(req, res, next) {
    var product = new Product();
    var imgname='default.jpg';
    product.category = req.body.category_name;
    product.description = req.body.product_description;
    product.name = req.body.product_name;
    product.sku = req.body.product_sku;
    product.price = req.body.product_price; 

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
    res.redirect('/admin/add-product');
});


//router.get('/admin/', ensureAuthenticated, (req, res) => res.render('pages/admin/dashboard',{ layout:'admin-layout' }));
//router.get('/admin/users', ensureAuthenticated, (req, res) => res.render('pages/admin/users',{ layout:'admin-layout' }));
//router.get('/admin/template-products', ensureAuthenticated, (req, res) => res.render('pages/admin/template-products',{ layout:'admin-layout' }));
router.get('/template-products/:page', function(req, res, next) {
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
  router.get('/users/:page', function(req, res, next) {
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
module.exports = router;