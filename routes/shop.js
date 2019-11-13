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
const Order = require('../models/Order');
var faker = require('faker');
const path = require('path');
const fs = require('fs');
router.get('/shopping-cart', 
function (req, res,next){
   if(!req.session.cart){
     res.render('pages/users/shopping-cart',{  products:{} });
   }
   var cart= new Cart(req.session.cart);
   var products =cart.generateArray();
   res.render('pages/users/shopping-cart',{ products:products,totalQty:cart.totalQty,totalPrice:cart.totalPrice })
   //console.log(products);
 });
 router.get('/checkout', 
 function (req, res,next){
    if(!req.session.cart){
      res.redirect('/shopping-cart');
    }
    var cart= new Cart(req.session.cart);
    var products =cart.generateArray();
    res.render('pages/public/checkout',{ products:products,totalQty:cart.totalQty,totalPrice:cart.totalPrice })
    //console.log(products);
  });
  router.post('/checkout',function(req,res,next){
        if (!req.session.cart) {
            return res.redirect('/shopping-cart');
        }
        var cart = new Cart(req.session.cart);
        
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
                paymentId: charge.id
            });
            order.save(function(err, result) {
                req.flash('success', 'Successfully bought product!');
                req.session.cart = null;
                res.redirect('/');
            });
        }); 
  });
  module.exports = router;