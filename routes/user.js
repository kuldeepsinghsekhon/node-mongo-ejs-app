const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const Cart = require('../models/Mycart');
const User = require('../models/User');
const Myorder = require('../models/Myorder');
const {ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { permit } = require('../config/role-auth');
router.get('/selling',ensureAuthenticated,permit('User'), function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    User
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, users) {
            User.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/users/selling', {
                    users: users,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  });
  router.get('/buying',ensureAuthenticated,permit('User'), function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
    //console.log(req.user._id);
    var query = { user: req.user._id };
    Myorder
        .find(query)
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
                res.render('pages/users/buying', {                  
                    orders: arr,
                    order_id:order_id,
                    payment:payment,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
                //console.log(orders);
            })
        })
 
  });
  router.get('/portfolio',ensureAuthenticated,permit('User'), function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    User
        .find({})
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
  });
router.get('/profile',ensureAuthenticated,permit('User'), function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    User
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, users) {
            User.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/users/profile', {
                    users: users,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  });
  router.get('/following',ensureAuthenticated,permit('User'), function(req, res, next) {
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
  });
  router.get('/setting',ensureAuthenticated,permit('User'), function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    User
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, users) {
            User.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/users/setting', {
                    users: users,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  });
module.exports = router;