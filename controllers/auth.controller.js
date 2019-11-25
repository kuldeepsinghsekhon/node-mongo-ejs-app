const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const path = require('path');
const fs = require('fs');
const stripe = require('stripe')('sk_test_eOl4PQxl78Ry0gZNIFMd6mED00aVcbzrUA');
exports.showSignUp=function(req,res,next){
    res.render('pages/public/sign-up',{layout:'login-layout'})
}

exports.signUp=function(req, res){
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
 }

 exports.showSignIn=function(req, res){
     res.render('pages/public/sign-in',{layout:'login-layout'})
}

exports.signIn=function(req, res, next){
      if(req.session.oldUrl){
        var oldUrl=req.session.oldUrl;
        req.session.oldUrl=null;
        res.redirect(oldUrl);
      }else{
        if(req.user.role=='Admin'){
          res.redirect('/admin/');
        }else{
          res.redirect('/user/profile');
        }      
      }    
    }
  
    exports.profile=function(req, res, next) {
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
    }
    
exports.saveinfoStripeStandard=function(req,res){

 var stripecode =req.query.code;
  var user=req.user;
  console.log(user);
  stripe.oauth.token({
    grant_type: 'authorization_code',
    code:stripecode,
  }).then(function(response) {
    // asynchronously called
    console.log(response);
    var connected_account_id = response.stripe_user_id;
    console.log('stripe connected access_token '+response.access_token);
    console.log('stripe connected refresh_token '+response.refresh_token);
    console.log('stripe connected connected_account_id '+connected_account_id);
    stripe.charges.create({
      amount: 2000,
      currency: "inr",
      source: "tok_visa",
    }, {
      stripe_account: connected_account_id,
    }).then(function(charge) {
      // asynchronously called
    });
  });
 
  res.redirect('/user/profile');
}