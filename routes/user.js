const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');
router.get('/selling', function(req, res, next) {
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
                    layout:'user-dashboard-layout'
                })
            })
        })
  });
  router.get('/buying', function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    User
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, users) {
            User.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/users/buying', {
                    users: users,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'user-dashboard-layout'
                })
            })
        })
  });
  router.get('/portfolio', function(req, res, next) {
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
                    layout:'user-dashboard-layout'
                })
            })
        })
  });
router.get('/profile', function(req, res, next) {
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
                    layout:'user-dashboard-layout'
                })
            })
        })
  });
  router.get('/following', function(req, res, next) {
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
                    layout:'user-dashboard-layout'
                })
            })
        })
  });
  router.get('/setting', function(req, res, next) {
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
                    layout:'user-dashboard-layout'
                })
            })
        })
  });
module.exports = router;