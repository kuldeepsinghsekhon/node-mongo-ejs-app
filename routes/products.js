const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const {ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

//router.get('/admin/template-products', ensureAuthenticated, (req, res) => res.render('pages/admin/template-products',{ layout:'admin-layout' }));
router.get('/',forwardAuthenticated, function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Product
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, products) {
            Product.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/public/products', {
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  });
  router.get('/:id',forwardAuthenticated, function(req, res, next) {
    var productId=req.params.id;
    product=Product.findById(productId,function(err,product){
    // if(err){
    //     return res.redirect('/');
    // }
        res.render('pages/public/product', {
          product: product,
          layout:'layout'
      })
  })
  });
  module.exports = router;