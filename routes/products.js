const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
//router.get('/admin/template-products', ensureAuthenticated, (req, res) => res.render('pages/admin/template-products',{ layout:'admin-layout' }));
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
                res.render('pages/public/products', {
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  });
  router.get('/:id', function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Product
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, products) {
            Product.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/public/product', {
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  });
  module.exports = router;