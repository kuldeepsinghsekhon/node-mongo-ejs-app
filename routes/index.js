const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
app.use(fileUpload());
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Product = require('../models/Product');
const User = require('../models/User');
const Role = require('../models/Role');
const Cart = require('../models/Mycart');
var faker = require('faker');
const path = require('path');
const fs = require('fs');
// Welcome Page
//router.get('/',  (req, res) => res.render('pages/public/home',{ layout: 'layout' }));
router.get('/', function(req, res, next) {
  var perPage = 9;
  var page = req.params.page || 1;
  Product
      .find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, products) {
          Product.count().exec(function(err, count) {
              if (err) return next(err)
              res.render('pages/public/home', {
                  products: products,
                  current: page,
                  pages: Math.ceil(count / perPage),
                  layout:'layout'
              })
          })
      })
});

// Register Page
router.get('/sign-up', forwardAuthenticated, (req, res) => res.render('pages/public/sign-up',{layout:'login-layout'}));

// Register
router.post('/sign-up', (req, res) => {
   const role=Role.User;
  // const name =req.body.name;
  // const email =req.body.email;
  // const password =req.body.password;
  // const password2 =req.body.password2;
  // const role =req.body.role;
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('pages/public/sign-up', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('pages/public/sign-up', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          role,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
               
                  if(req.session.oldUrl){
                    var oldUrl=req.session.oldUrl;
                    req.session.oldUrl=null;
                    res.redirect(oldUrl);
                  }else{
                    res.redirect('/sign-in');
                  }    
               
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});
// Login Page
router.get('/sign-in', forwardAuthenticated, (req, res) => res.render('pages/public/sign-in',{layout:'login-layout'}));

// Login
router.post('/sign-in', passport.authenticate('local', {
    failureRedirect: '/sign-in',
    failureFlash: true}),function(req, res, next){
      if(req.session.oldUrl){
        var oldUrl=req.session.oldUrl;
        req.session.oldUrl=null;
        res.redirect(oldUrl);
      }else{
        res.redirect('/');
      }    
    });

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/sign-in');
});
router.get('/add-to-cart/:id', (req, res,next) => {
  var cart= new Cart(req.session.cart?req.session.cart:{});
  var productId=req.params.id;
  Product.findById(productId,function(err,product){
    if(err){
        return res.redirect('/');
    }
    cart.add(product,product.id);
    req.session.cart=cart;
    console.log(  req.session.cart);
    res.redirect('/products');
  })
});
  router.get('/shopping-cart', 
 function (req, res,next){
    if(!req.session.cart){
      res.render('pages/users/shopping-cart',{  products:{} });
    }
    var cart= new Cart(req.session.cart);
    var products =cart.generateArray();
    res.render('pages/users/shopping-cart',{ products:products,totalQty:cart.totalQty,totalPrice:cart.totalPrice })
    console.log(products);
  });
module.exports = router;