const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth.controller');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Product = require('../models/Product');
const Cart = require('../models/Mycart');
const product_controller = require('../controllers/product.controller');
router.get('/',forwardAuthenticated, product_controller.products);
// router.get('/',forwardAuthenticated, function(req, res, next) {
//   var perPage = 9;
//   var page = req.params.page || 1;
//   Product
//       .find({})
//       .skip((perPage * page) - perPage)
//       .limit(perPage)
//       .exec(function(err, products) {
//           Product.count().exec(function(err, count) {
//               if (err) return next(err)
//               res.render('pages/public/home', {
//                   products: products,
//                   current: page,
//                   pages: Math.ceil(count / perPage),
//                   layout:'layout'
//               })
//           })
//       })
// });

// Register Page fbsign-in
router.get('/sign-up',forwardAuthenticated, forwardAuthenticated,auth_controller.showSignUp);
// Register
router.post('/sign-up',auth_controller.signUp);
router.get('/validate',auth_controller.signUpValidate);
// Login Page
router.get('/sign-in',auth_controller.showSignIn );
  router.get('/auth/facebook', passport.authenticate('facebook', { 
    scope : ['public_profile', 'email']
  }));
  router.get('/auth/twitter', passport.authenticate('twitter'));
  router.get('/auth/facebook/callback',passport.authenticate('facebook', {
            successRedirect : '/user/profile',
            failureRedirect : '/'
        }));
 router.get('/auth/google',  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/user/profile');
  });
  router.post('/fbsign-in',forwardAuthenticated, forwardAuthenticated,auth_controller.fbSignUpSignin);
  router.get('/auth/twitter/callback',  passport.authenticate('twitter', { successRedirect: '/',failureRedirect: '/login' }));
// Logout
router.get('/logout',forwardAuthenticated, (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/sign-in');
});
router.get('/add-to-cart/:id', forwardAuthenticated,(req, res,next) => {
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
  router.get('/shopping-cart', forwardAuthenticated,
 function (req, res,next){
    if(!req.session.cart){
      res.render('pages/users/shopping-cart',{  products:{} });
    }
    var cart= new Cart(req.session.cart);
    var products =cart.generateArray();
    res.render('pages/users/shopping-cart',{ products:products,totalQty:cart.totalQty,totalPrice:cart.totalPrice })
    console.log(products);
  });
  router.get('/forbidden', forwardAuthenticated,(req, res,next) => res.render('pages/public/sign-in',{
    message: "Forbidden",
    category:req.category,
  }));
  router.get('/contactus', forwardAuthenticated,(req, res) => res.render('pages/public/contactus',{
    layout:'layout',
    category:req.category,
  }));
  router.get('/about',forwardAuthenticated, (req, res,next) => res.render('pages/public/aboutus',{
    category:req.category,
    layout:'layout'
  }));
  router.get('/search',forwardAuthenticated, (req, res) => res.render('pages/public/search',{
    layout:'layout',
    category:req.category
  }));

  router.get('/saveinfo-stripe-standard',forwardAuthenticated,auth_controller.saveinfoStripeStandard);
  router.get('/category/:category_slug',forwardAuthenticated,product_controller.productsByCategory);
  router.get('/saleschart/:id',forwardAuthenticated,product_controller.findByIdChart);
  router.get('/sellsearch',forwardAuthenticated,product_controller.showSellSearch);
  router.get('/productsearch',forwardAuthenticated,product_controller.sellProductSearchReasult);

module.exports = router;