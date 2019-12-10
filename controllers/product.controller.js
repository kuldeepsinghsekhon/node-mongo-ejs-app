const braintree = require("braintree");
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');
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
    req.session.oldUrl='/products/'+productId;
    product=Product.findById(productId,function(err,product){
    // if(err){
    //     return res.redirect('/');
    // }
        res.render('pages/public/product-detail', {
          product: product,
          layout:'layout'
      })
  })
}
/*********** select Product Variant ***************/
exports.sellProductVariant=function(req, res, next) {
  var productId=req.params.id;
  req.session.oldUrl='/products/'+productId;
  product=Product.findById(productId,function(err,product){
  // if(err){
  //     return res.redirect('/');
  // }
      res.render('pages/public/sell-product-variant', {
        product: product,
        layout:'layout'
    })
})
}
/*********** Product Sell Or Ask  ***************/
const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "dwt5m34ppngz6s7k",       //merchant id
  publicKey: "g2d976m7dxpt6bx5",        //public key
  privateKey: "117df9268ade2b95fc3f526966441059" //private key
});
exports.sellProductOrAsk=function(req, res, next) {
  var productId=req.params.id;
  req.session.oldUrl='/products/'+productId;
  product=Product.findById(productId,function(err,product){
        if(!req.body.payment_method){
          res.render('pages/public/product-sell-payment-method', {
            product: product,
            layout:'layout'
        });
        }else{

          gateway.clientToken.generate({
            customerId: 2222
          }, function (err, response) {
            let clientToken = response.clientToken;
            console.log(clientToken);
            res.render('pages/public/product-sellorask', {
              product: product,
              clientToken:clientToken,
              layout:'layout'
          })
            console.log(err);
          });      
        }
      })
}

exports.sellAsk= function(req, res,next){
 
  var nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  var newTransaction = gateway.transaction.sale({
    amount: '47.54',
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, function(error, result) {
      if (result) {
        res.send(result);
      } else {
        res.status(500).send(error);
      }
  });
  }

exports.adminProducts=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Product
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, products){
            Product.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/admin/template-products', {
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'admin-layout'
                })
            })
        })
  }

/* admin can add Product */
exports.saveProduct=function(req, res, next) {
    var product = new Product();
    var imgname='default.jpg';
    product.category = req.body.category_name;
    product.description = req.body.product_description;
    product.name = req.body.product_name;
    product.sku = req.body.product_sku;
    product.price = req.body.product_price; 
    product.style = req.body.style; 
    let errors = [];
    if (!req.body.category_name || !req.body.product_description || !req.body.product_name || !req.body.product_sku
      || !req.body.product_price || !req.body.style ) {
      errors.push({ msg: 'Please enter all Required fields' });
    }
  
    // if (password != password2) {
    //   errors.push({ msg: 'Passwords do not match' });
    // }
  
    if (errors.length > 0) {
      res.render('pages/admin/add-product', {
        errors ,
        layout:'admin-layout'
      });
    } else {
  
    var imgpath=appRoot+'//public//uploads//products//';
    var mask=777;
      fs.mkdir(imgpath, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') console.log(null); // ignore the error if the folder already exists
            else console.log(err); // something else went wrong
        } else console.log(null); // successfully created folder
    });

    if (!req.files || Object.keys(req.files).length=== 0) {
      return res.status(400).send('No files were uploaded.');
    }else{
      let productImage1 = req.files.productImage;
      imgname=Date.now()+path.extname(req.files.productImage.name);
      productImage1.mv(imgpath+'//'+imgname, function(err) { 
        if (err) throw err
        //return res.status(500).send(err);
        //res.send('File uploaded!');}
      });        
    }

    product.image = imgname;

    product.save(function(err,product) {
        if (err){
          throw err
        } else{
             // console.log(product);         
        }      
    });
    req.flash(
      'success_msg',
      'Product Addded Successfully'
    );
    res.redirect('/admin/add-product');
  }
    
}
/* View Page for admin can edit Product*/
exports.editProduct=function(req, res, next) {
    var productId=req.params.id;
        product=Product.findById(productId,function(err,product){
        // if(err){
        //     return res.redirect('/');
        // }
            res.render('pages/admin/edit-product', {
              product: product,
              layout:'admin-layout'
          })
      })
  }
  /* Admin can update Product */
  exports.updateProduct=function (req, res,next) {
    var productId=req.params.id.replace(" ", "");
    var product = new Product();
    var imgname='default.jpg';
    product.category = req.body.category_name;
    product.description = req.body.product_description;
    product.name = req.body.product_name;
    product.sku = req.body.product_sku;
    product.price = req.body.product_price;
    var imgpath=appRoot+'//public//uploads//products//';
    var img='';
    var prod={name:req.body.product_name, description:req.body.product_description,category:req.body.category_name,sku:req.body.product_sku,price:req.body.product_price,style: req.body.style };
    if (!req.files || Object.keys(req.files).length=== 0) {
      //console.log('No files were uploaded.');
    }else{  
      let productImage1 = req.files.productImage;
        imgname=Date.now()+path.extname(req.files.productImage.name);
        productImage1.mv(imgpath+'//'+imgname, function(err) { 
          if (err) throw err
          //return res.status(500).send(err);
          //res.send('File uploaded!');}
        });  
        prod={name:req.body.product_name,description:req.body.product_description,category:req.body.category_name,sku:req.body.product_sku,price:req.body.product_price,style: req.body.style,image:imgname };     
     // console.log(img);
    }
    Product.findByIdAndUpdate(productId, {$set:prod}, function (err, product) {
            if (err) return next(err);
            res.redirect('/admin/template-products/1');
        });
      }