const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const path = require('path');
const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const utils_controller = require('../controllers/utils.controller');
const TokenGenerator = require('uuid-token-generator');
const braintree = require("braintree");
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "dwt5m34ppngz6s7k",       //merchant id
  publicKey: "g2d976m7dxpt6bx5",        //public key
  privateKey: "117df9268ade2b95fc3f526966441059" //private key
});
exports.showSignUp=function(req,res,next){
    res.render('pages/public/sign-up',{layout:'login-layout'})
}

exports.signUp=function(req, res){
    const role=Role.User;
    const tokgen = new TokenGenerator(); // Default is a 128-bit token encoded in base58
    const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], style: 'capital' }); // big_red_donkey
    const token=tokgen.generate();
   // const name =req.body.name;
   // const email =req.body.email;
   // const password =req.body.password;
   // const password2 =req.body.password2;
   // const role =req.body.role;
   const { name, email, password, password2,lastname } = req.body;
   let errors = [];
 
   if (!name || !email || !password || !password2 ||!lastname) {
     errors.push({ msg: 'Please enter all fields' });
   }
 
   if (password != password2) {
     errors.push({ msg: 'Passwords do not match' });
   }
 
   if (password.length < 6) {
     errors.push({ msg: 'Password must be at least 6 characters' });
   }
 
   if (errors.length > 0) {
    res.json({status:'error',errors:errors,name:name,lastname:lastname,email:email,password:password,password2:password2});

    //  res.render('pages/public/sign-up', {
    //    errors,
    //    name,
    //    email,
    //    password,
    //    password2
    //  });
   } else {
     User.findOne({ email: email }).then(user => {
       if (user) {
         errors.push({ msg: 'Email already exists' });
        //  res.render('pages/public/sign-up', {
        //    errors,
        //    name,
        //    email,
        //    password,
        //    password2
        //  });
        res.json({status:'error',errors:errors,name:name,lastname:lastname,email:email,password:password,password2:password2});
       } else {
         const newUser = new User({
           name,
           lastname,
           email,
           password,
           role,
           token,
         });
         gateway.customer.create({
          firstName: name,
          lastName: name+'dfd',
          //company: "Braintree",
          email: email,
          //phone: "312.555.1234",
         // fax: "614.555.5678",
         // website: "www.example.com"
        }, function (err, result) {
          result.success;
          // true
        
          newUser.braintreeid=result.customer.id;
          console.log(result.customer.id);
          // e.g. 494019
        });
         bcrypt.genSalt(10, (err, salt) => {
           bcrypt.hash(newUser.password, salt, (err, hash) => {
             if (err) throw err;
             newUser.password = hash;
             newUser.username = randomName;
             newUser
               .save()
               .then(user => {
                 var token=token;
                 var userid=user._id;
                
                var mailOptions = {
                  from: 'aquatecinnovative1@gmail.com',
                  to: user.email,
                  subject: 'Validate Your Account',
                  text: 'Thanks For Register Your Validation Token is <h1>'+token+'</h1>'
                };
                console.log(user);
                utils_controller.sendmymail(mailOptions);
                //  req.flash(
                //    'success_msg',
                //    'You are now registered and can log in'
                //  );
                res.json({status:'ok',userid:userid,name:user.name,lastname:user.lastname,username:randomName,email:user.email});

                 //  if(req.session.oldUrl){
                    // var oldUrl=req.session.oldUrl;
                    // req.session.oldUrl=null;
                     //res.redirect(oldUrl);
                     //res.redirect('/sign-in');
                  // }else{
                     //res.redirect('/sign-in');
                  // }    
                
               })
               .catch(err => console.log(err));
           });
         });
       }
     });
   }
 }
 exports.validationForm=function(req,res,next){
  var userid = req.params.userid;
  User.findOne({ _id: userid }).then(user => {
    if (err) throw err;
    res.render('pages/public/validation-form', {
      layout:'login-layout',
      user:user
    });
  })
 
 }
exports.signUpValidate=function (req,res,next) {
  var userid=req.body.userid;
  var token=req.body.token;

  User.findOne({ _id: userid }).then(user => {
    if (user) {
      if(token==user.token){
        console.log(token);
        console.log(userid);
        user.validated=1;
        user.save(function(err) {
          if (err) throw err;
          console.log(user);
        });
      }
      res.json({status:'ok',userid:userid,username:randomName,email:user.email,validate:true});
    } else {     
      res.json({status:'error',userid:userid,username:randomName,email:user.email,validate:false});
    }
  });
}
 exports.showSignIn=function(req, res){
     res.render('pages/public/sign-in',{layout:'login-layout'})
}
exports.fbSignUpSignin=function (req,res,next) {
  res.json({success :'ok'})
}

exports.signIn=function(req, res, next){
   
        if(req.user.role=='Admin'){
          res.json({status:'ok',userid:req.user._id,username:req.user.randomName,email:req.user.email,validate:true,role:req.user.role});

         // res.redirect('/admin/');
        }else if(req.user.role=='User'){
          if(req.session.oldUrl){
             var oldUrl=req.session.oldUrl;
            req.session.oldUrl=null;
            res.json({status:'ok',userid:req.user._id,username:req.user.randomName,email:req.user.email,validate:true,url:req.user.oldUrl});

           }else{
            res.json({status:'ok',userid:req.user._id,username:req.user.randomName,email:req.user.email,validate:true});

           }
         
       } else{
        res.json({status:'error',message:'Email Or password are incorrect '});

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
  }).then(function(response){
    // asynchronously called
    console.log(response);
    console.log('stripe connected access_token '+response.access_token);
    console.log('stripe connected refresh_token '+response.refresh_token);
    console.log('stripe connected connected_account_id '+response.stripe_user_id);
  });
  res.redirect('/user/profile');
}


// stripe.charges.create({
//   amount: 2000,
//   currency: "inr",
//   source: "tok_visa",
// }, {
//   stripe_account: connected_account_id,
// }).then(function(charge) {
//   // asynchronously called
// });