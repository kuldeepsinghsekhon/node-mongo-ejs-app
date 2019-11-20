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
const Cart = require('../models/Mycart');
const Order = require('../models/Myorder');
var faker = require('faker');
const path = require('path');
const fs = require('fs');
router.get('/shopping-cart', forwardAuthenticated,
function (req, res,next){
   if(!req.session.cart){
     res.render('pages/users/shopping-cart',{  products:{} });
   }
   var cart= new Cart(req.session.cart);
    
   var products =cart.generateArray();
   res.render('pages/users/shopping-cart',{ products:products,totalQty:cart.totalQty,totalPrice:cart.totalPrice })
   //console.log(products);
 });
 router.get('/payment-method', forwardAuthenticated,
 function (req, res,next){
   
    res.render('pages/public/payment-method')
    //console.log(products);
  });
  router.get('/product/:id',ensureAuthenticated,permit('User'), function(req, res, next) {
    var productId=req.params.id;
        product=Product.findById(productId,function(err,product){
        // if(err){
        //     return res.redirect('/');
        // }
            res.render('pages/public/product-checkout', {
              product: product,
              layout:'layout'
          })
      })
  });
 router.get('/checkout/:id', ensureAuthenticated,permit('User'),
 function (req, res,next){
  req.session.cart = {};
  var productId=req.params.id;
    // if(!req.session.cart){
    //   res.redirect('/shopping-cart');
    // }
    //var cart= new Cart(req.session.cart);
  
    Product.findById(productId,function(err,product){
      var cart= new Cart({});
      if(err){
          return res.redirect('/');
      }
     // console.log(product);
      cart.add(product,product.id);   
      req.session.cart=cart; 
      var products =cart.generateArray();
      res.render('pages/public/checkout',{ products:products,product:product,totalQty:cart.totalQty,totalPrice:cart.totalPrice })
      //console.log( req.session.cart+'cart');
    });
  
  });
  router.post('/checkout',ensureAuthenticated,permit('User'),function(req,res,next){
        // if (!req.session.cart) {
        //     return res.redirect('/shopping-cart');
        // }
        var cart = new Cart(req.session.cart);
       // console.log(req.session.cart+'fdfdfd');
        var stripe = require("stripe")(
            "sk_test_eOl4PQxl78Ry0gZNIFMd6mED00aVcbzrUA"
        );
    
        stripe.charges.create({
            amount: cart.totalPrice * 100,
            currency: "inr",
            source: req.body.stripeToken, // obtained with Stripe.js
            description: "Test Charge",
            
        }, function(err, charge) {
            if (err) {
                req.flash('error', err.message);
                console.log(err);
                return res.redirect('/shop/checkout');
               
            }
            var order = new Order({
                user: req.user,
                cart: cart,
                address: req.body.address,
                name: req.body.name,
                paymentId: charge.id,
                payment:charge
            });
            console.log(charge);
            order.save(function(err, result) {
                req.flash('success', 'Successfully bought product!');
                req.session.cart = null;
                res.redirect('/user/buying');
            });
        }); 
  });
  module.exports = router;