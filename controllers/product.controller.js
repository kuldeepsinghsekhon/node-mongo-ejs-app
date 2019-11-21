const Product = require('../models/Product');
exports.products = function(req, res, next) {
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
  }
  
  exports.findById=function(req, res, next) {
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
}