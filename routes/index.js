const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
app.use(fileUpload());
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const nodemailer = require('nodemailer');
const Product = require('../models/Product');
var faker = require('faker');
const path = require('path');
const fs = require('fs');
//var now  = require('performance-now');


//const hrTime = process.now('nano') ;

router.get('/admin/add-product', function(req, res, next) {
    res.render('pages/admin/add-product',{layout:'admin-layout'});
    console.log(appRoot);
    //console.log(now());
    var t=Date.now();
        
    console.log(t);
   
})

router.post('/admin/add-product', function(req, res, next) {
    var product = new Product();
    var imgname='ss';
    product.category = req.body.category_name;
    product.name = req.body.product_name;
    product.price = req.body.product_price;
    product.cover = faker.image.image();
    if (!req.files || Object.keys(req.files).length=== 0) {
      return res.status(400).send('No files were uploaded.');
    }
    
    product.save(function(err,product) {

        if (err){
          throw err
        } else{
              console.log(product);
              var imgpath=appRoot+'\\public\\uploads\\products\\'+product.id;
              var mask=777;
                fs.mkdir(imgpath, mask, function(err) {
                  if (err) {
                      if (err.code == 'EEXIST') console.log(null); // ignore the error if the folder already exists
                      else console.log(err); // something else went wrong
                  } else console.log(null); // successfully created folder
              });
              if (!req.files || Object.keys(req.files).length=== 0) {
                return res.status(400).send('No files were uploaded.');
              }
              let productImage1 = req.files.productImage;
               imgname=Date.now()+path.extname(req.files.productImage.name);
              productImage1.mv(imgpath+'\\'+imgname, function(err) { 
                console.log(imgpath+imgname);
                if (err) throw err
                //return res.status(500).send(err);
                //res.send('File uploaded!');}
              });        
        }
       
    });
    res.redirect('/admin/add-product');
});

const transporter = nodemailer.createTransport({
    host: 'in-v3.mailjet.com',
    port: 587,
    requireTLS: true,
    auth: {
        user: 'a63f9f06d525f9ec6270729a89704cfe',
        pass: '34a8564fc34463f7563679c4efc34bee'
    }
  });
var mailOptions = {
    from: 'aquatecinnovative1@gmail.com',
    to: 'sekhon.game@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome',{ layout: 'layout' }));
router.get('/admin/', ensureAuthenticated, (req, res) => res.render('pages/admin/dashboard',{ layout:'admin-layout' }));
router.get('/admin/users', ensureAuthenticated, (req, res) => res.render('pages/admin/users',{ layout:'admin-layout' }));
//router.get('/admin/template-products', ensureAuthenticated, (req, res) => res.render('pages/admin/template-products',{ layout:'admin-layout' }));
router.get('/admin/template-products/:page', function(req, res, next) {
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

router.get('/generate-fake-data', function(req, res, next) {
  for (var i = 0; i < 90; i++) {
      var product = new Product()

      product.category = faker.commerce.department()
      product.name = faker.commerce.productName()
      product.price = faker.commerce.price()
      product.cover = faker.image.image()

      product.save(function(err) {
          if (err) throw err
      })
  }
  res.redirect('/add-product')
})
router.get('/mailtest', forwardAuthenticated, (req, res) =>{
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.render('mailtest');
} );
// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router;
