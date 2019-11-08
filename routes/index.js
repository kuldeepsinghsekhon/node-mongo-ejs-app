const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
app.use(fileUpload());
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const nodemailer = require('nodemailer');
const Product = require('../models/Product');
const User = require('../models/User');
var faker = require('faker');
const path = require('path');
const fs = require('fs');

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
// Login Page
router.get('/sign-in', forwardAuthenticated, (req, res) => res.render('pages/public/sign-in',{layout:'login-layout'}));

// Register Page
router.get('/sign-up', forwardAuthenticated, (req, res) => res.render('pages/public/sign-up',{layout:'login-layout'}));

// Register
router.post('/sign-up', (req, res) => {
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
                res.redirect('/sign-in');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/sign-in', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign-in',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/sign-in');
});

module.exports = router;

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


module.exports = router;
