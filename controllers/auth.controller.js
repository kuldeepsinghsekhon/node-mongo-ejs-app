const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const path = require('path');
const fs = require('fs');

exports.showSignUp=function(){
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