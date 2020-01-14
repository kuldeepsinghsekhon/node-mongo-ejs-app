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
    const newUser = new User();
    const tokgen = new TokenGenerator(); // Default is a 128-bit token encoded in base58
    const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], style: 'capital' }); // big_red_donkey
    const token=Math.ceil(Math.random() * 1000000); //tokgen.generate();
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
    res.json({status:'error',data:{errors:errors,name:name,lastname:lastname,email:email,password:password,password2:password2},message:'Failed To Register'});

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
        res.json({status:'error',data:{errors:errors,name:name,lastname:lastname,email:email,password:password,password2:password2},message:'Error Failed To register'});
       } else {
         
           newUser.name=name;
           newUser.lastname=lastname;
           newUser.email=email;
           newUser.password=password
           newUser.role=role;
           newUser.token=token;
        
         var braintreeid='';
         gateway.customer.create({
          firstName: name,
          lastName: lastname,
          email: email,

        }, function(err, result) {
         // result.success;
        if(result){
          braintreeid=result.customer.id;
          newUser.braintreeid=result.customer.id;
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.username = randomName;
             // console.log(newUser);
              newUser.save()
                .then(user => {
                  var token=user.token;
                  var userid=user._id;
                 var mailOptions = {
                   from: 'aquatecinnovative1@gmail.com',
                   to:'stockxa1@gmail.com', //user.email,
                   subject: 'Validate Your Account',
                   html: 'Thanks For Registering  with email <h3>'+user.email+'</h3><p> Your Validation Token is </p><h1>'+token+'</h1>'
                 };
                 //console.log(user);
                 utils_controller.sendmymail(mailOptions);
                 //  req.flash(
                 //    'success_msg',
                 //    'You are now registered and can log in'
                 //  );
                 res.json({status:'success',data:{userid:userid,name:user.name,lastname:user.lastname,username:randomName,email:user.email},message:"Thanks For Register"});
 
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
        }else{
          res.json({status:'error',data:{},message:"Error in Register"});
        }
         
        })
               
       }
     });
   }
 }
 exports.validationForm=function(req,res,next){
  var userid = req.params.userid.replace(" ","");
  User.findOne({ _id: userid }).then(user => {
    res.render('pages/public/validation-form', {
      layout:'login-layout',
      user:user
    });
  })
 }
exports.signUpValidate=function (req,res,next) {
  var userid=req.body.userid;
  var token=req.body.token;
  let errors = [];
    User.findOne({ _id: userid }).then(user => {
    if (user) {
          if(token==user.token){
            //console.log(token);
           // console.log(userid);
            user.validated=1;
            user.save(function(err) {
              if (err) throw err;
             // console.log(user);
            });
            res.json({status:'success',data:{userid:userid,validate:true},message:'Validation Success'});
          }else{ errors.push({ msg: 'Incorrect Validation Token ' });
          res.json({status:'error',data:{errors:errors,userid:userid,token:token,validate:false},message:'Validation Error'});
        }
     } //else { 
    //   errors.push({ msg: 'User Dose not exists' });    
    //   res.json({status:'error',data:{errors:errors,userid:userid,token:token,validate:false},message:'Validation Error'});
    // }
  }).catch(function(err) {
      errors.push({ msg: 'User Dose not exists' });    
    res.json({status:'error',data:{errors:errors,userid:userid,token:token,validate:false},message:'Validation Error'});
  });
}
 exports.showSignIn=function(req, res){
     res.render('pages/public/sign-in',{layout:'login-layout'})
}
exports.fbSignUpSignin=function (req,res,next) {
  res.json({success :'ok'})
}

exports.signIn=function(req, res, next){
  let errors=[];
        if(req.user.role=='Admin'){
          res.json({status:'success',userid:req.user._id,username:req.user.username,email:req.user.email,validate:true,role:req.user.role});

         // res.redirect('/admin/');
        }else if(req.user.role=='User'){
          if(req.session.oldUrl){
             var oldUrl=req.session.oldUrl;
            req.session.oldUrl=null;
            res.json({status:'success',data:{userid:req.user._id,username:req.user.username,email:req.user.email,validate:true,url:req.user.oldUrl},message:''});
           }else{
            res.json({status:'success',data:{userid:req.user._id,username:req.user.username,email:req.user.email,validate:true},message:''});

           }
         
       } else{
        res.json({status:'error',data:{errors:errors},message:'Email Or password are incorrect '});
       }     
         
    }
  
    exports.profile=function(req, res, next) {
      User
      .findOne({user:req.user})
          .exec(function(err, users) {
              User.count().exec(function(err, count) {
                  if (err) return next(err)
                  res.render('pages/users/profile', {
                      users: users,                    
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


//router.post('/update_password',forwardAuthenticated, auth_controller.reset_Pword);

exports.showChangePassword = function(req,res,next){
  var token=req.query.t;
  var userid=req.query.id;
    User.findOne({_id:userid,token:token})
    .exec(function(err, users) {
      console.log(users);
      if(users){
         res.render('pages/public/change_password',{layout:'login-layout',token:token,userid:users._id});
      }else{
        res.redirect('/user/setting');
      }
    })
}
exports.updateChangePassword=function(req,res,next){
  var token=req.body.token;
  var password=req.body.password;
  const user_id=req.body.userid;
  
  const  filter={_id:user_id,token:token};
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      password = hash;
      const update={password:password};  
      User.findOneAndUpdate(filter, {$set:update},{new: true}, function (err, user) {   
            if (user) {
              res.json({status:'success',data:{user:user},message:'password update successfully'});
            }else{
              console.log(err);
              res.status(200).json({status:"error",data:{user:[]},message:"failed to update"})
            }    
      });
    })
  });
}

exports.forgetPassword=function(req,res,next){
  res.render('pages/public/forget',{layout:'login-layout'});
}

exports.forgetPasswordReset = function(req,res,next){
    email = req.body.email;
    User.findOne({email:email}).exec(function(err, users) {
    if(!users)
  { 
    errors.push({ msg: 'Email is not exists. Register First' });
  }else{
    const token=Math.ceil(Math.random() * 1000000);
    var mailOptions = {          
      from: 'aquatecinnovative1@gmail.com',
      to:email, //user.email,
      subject: 'Reset Password',
     
      html: 'Please <a href="http://localhost:5000/sign-in/reset_password/?t='+token+'?id='+users._id+'"> Click Here </a> to reset Password <h3></h3><p> Your Validation Token is </p><h1>'+token+'</h1>'
    };
    //console.log(user);
    //utils_controller.sendmymail(mailOptions);
    User.findOneAndUpdate({email:email},{token:token})
    .exec(function(err, user) {
            if (err) return next(err)
              res.render('/sign-in/reset_password', {layout:'login-layout'}) ;
        }) ;
    }
  });
  }
  exports.forgetresetPassword = function(req,res,next) {
  
  }
  exports.updateforgetresetpassword = function(req,res,next) {
    token = req.params.token ;
    console.log(token);
  }