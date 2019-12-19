const braintree = require("braintree");
const Product = require('../models/Product');
const SellBid = require('../models/SellBid');
const BuyBid = require('../models/BuyBid');
const Address = require('../models/Address');
const Attribute = require('../models/Attribute');
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
    //   res.render('pages/public/sell-product-variant', {
    //     product: product,
    //     layout:'layout'
    // })
        res.render('pages/public/product-detail', {
          product: product,
          layout:'layout'
      })
  })
}
/*********** select Product Variant ***************/
exports.sellProductVariant= async function(req, res, next) {
  var productId=req.params.id;//productId:productId
  req.session.oldUrl='/products/'+productId;
  Promise.all([
    Product.findOne({ _id: productId }).populate({path:'attrs'}),
    SellBid.findOne({productid:productId}).sort({bidprice:+1}).limit(1),
    BuyBid.findOne({productid:productId}).sort({bidprice:-1}).limit(1)
  ]).then( ([ product, sellbid,highbid ]) => {
    res.render('pages/public/product-sellorask', {
      product: product,
      lowbid:sellbid,
      highbid:highbid,
      layout:'layout'
     })
   // console.log( product );
    console.log( sellbid );
  });
//  // console.log('fdsf');

//   product=  Product.findOne({ '_id':productId })
//   .populate({path:'attrs'})
//   .populate({path:'selbids',
//   options: {
//     productid:productId,
//     sort: { bidprice: -1 },
//     limit: 1
//   }})
//   .exec(function(err,product){
//     //console.log(product);
//     //var bidp='';
//    // console.log(bidp);
//     res.render('pages/public/product-sellorask', {
//            product: product,
//            layout:'layout'
//           })
//           //console.log(bidp);
//         // if(err){
//         //     return res.redirect('/');
//         // }
//         // if(product.attrs.length>0){
//         //   res.render('pages/public/sell-product-variant', {
//         //     product: product,
//         //      layout:'layout'
//         //  })
//         // }else{
//         //   res.render('pages/public/product-sellorask', {
//         //     product: product,
//         //     layout:'layout'    
//       // })
//         // }
//     })
}
exports.sellLowestBid=function name(req,res,next) {
  SellBid.find({productid:productId}).sort({bidprice:+1}).limit(1).exec(function(err, bid){
    SellBid.count().exec(function(err, count) {
      if(err)console.log(err);
      console.log(bid);
      res.json({ bid:bid});
    }); 
  })

}

/*********** Product Sell Or Ask  ***************/
const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "dwt5m34ppngz6s7k",       //merchant id
  publicKey: "g2d976m7dxpt6bx5",        //public key
  privateKey: "117df9268ade2b95fc3f526966441059" //private key
});
exports.sellProductVariantNowPay=function(req, res, next) {
  var productId=req.params.id;
    product=Product.findById(productId,function(err,product){
      res.render('pages/public/product-sell-payment-method', {
          product: product,
          layout:'layout'
      });
    })
}
exports.sellCalculateCharges=function(req, res, next) {
   var productId=req.body.id;
     product=Product.findById(productId,function(err,product){
      var askprice=0; 
     
      if(!req.body.askprice){
        askprice=product.price;
       }else{
        askprice=req.body.askprice;
        var expiry=req.body.expiry;
        expiry=expiry.split("Days").map(Number);       
        console.log(expiry[0]);
       }
     var TransactionFee=askprice*0.09;
     var Proc=askprice*0.03;
     var Shipping=30;
     var totalpayout=askprice-(TransactionFee+Proc+Shipping);
      res.json({ TransactionFee: TransactionFee ,Proc:Proc,Shipping:Shipping,discountcode:'',totalpayout:totalpayout });
      })
  //res.json({ username: 'Flavio' });
}
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
exports.sellProductPay=function(req,res){
  var productId=req.body.id;
  product=Product.findById(productId,function(err,product){
 
      res.render('pages/public/product-sell-payment', {
        product: product,
        layout:'blank-layout' });
      });
}

exports.sellAsk=async  function(req, res,next){
  var sellBid = new SellBid();
  const productId= req.body.productid;
  sellBid.productid = req.body.productid;
  sellBid.bidprice = req.body.bidprice;
  sellBid.user = req.user;//Date.now()
  sellBid.biddate=Date.now();
  sellBid.status="ask";
  
  sellBid.save();
  let sellbids=[];
 var prod=await Product.findById(productId).populate('selbids');
 prod.sellbids.push(sellBid);
  prod.save();
  console.log(prod);
  //console.log(sellBid);
  //console.log('sellBid');
  var nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  var newTransaction = gateway.transaction.sale({
    amount: req.body.bidprice,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, function(error, result) {
      if (result) {
        res.send(result);
       // console.log(result);
      } else {
        res.status(500).send(error);
      }
  });
  }
/*************Buy and BuyBid Start**************/
exports.buyProductVariant=function name(req,res,next) {
  var productId=req.params.id;//productId:productId
  req.session.oldUrl='/products/'+productId;
  Promise.all([
    Product.findOne({ _id: productId }).populate({path:'attrs'}),
    SellBid.findOne({productid:productId}).sort({bidprice:+1}).limit(1),
    SellBid.findOne({productid:productId}).sort({bidprice:-1}).limit(1),
    Address.findOne({address_type:'shipping',user:req.user}).limit(1),
    Address.findOne({address_type:'billing',user:req.user}).limit(1)
  ]).then( ([ product, sellbid,highbid,shippingAddress,billingAddress ]) => {
    res.render('pages/public/product-buyorbid', {
      product: product,
      lowbid:sellbid,
      highbid:highbid,
      shippingAddress:shippingAddress,
      billingAddress:billingAddress,
      layout:'layout'
     })
   // console.log( product );
    console.log( sellbid );
  });
}
exports.plcaeBuyBid=function name(req,res,next) {
  
}
exports.calculateBuyCharges=function name(req,res,next) {
  var productId=req.body.id;
  product=Product.findById(productId,function(err,product){
   var askprice=0; 
   if(!req.body.askprice){
     askprice=product.price;
    }else{
     askprice=req.body.askprice;
     var expiry=req.body.expiry;
     expiry=expiry.split("Days").map(Number);
     console.log(expiry[0]);
    }
    var processingFee=askprice*0.09;
    var Proc=askprice*0.03;
    var Shipping=30;
    var totalpayout=askprice-(processingFee+Proc+Shipping);
   res.json({ TransactionFee: processingFee ,Proc:Proc,Shipping:Shipping,discountcode:'',totalpayout:totalpayout });
   })
}
exports.buyBillingShipping=function(req,res){
  var productId=req.body.id;
  product=Product.findById(productId,function(err,product){ 
      res.render('pages/public/product-buy-billing-shipping', {
        product: product,
        layout:'blank-layout' });
      });
}
exports.buyShipping=function(req,res){
  var productId=req.body.id;
  product=Product.findById(productId,function(err,product){ 
      res.render('pages/public/product-buy-shipping-info', {
        product: product,
        layout:'blank-layout' });
      });
}

/*************Buy and BuyBid End **************/
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
    //console.log(req.body.attributename);
    let attributes=[];
    if(req.body.attributename){

      const attributename=req.body.attributename;
      const attributevalues=req.body.attributevalues;
     for(var i = 0; i < attributename.length;i++){
       var attribut= new Attribute();
       attribut.name=attributename[i];
       attribut.attrs=attributevalues[i].split('|');
       attribut.save();
       attributes.push(attribut);
      }
    }
    product.attrs = attributes; 
    //console.log(req.body.attributevalues);
  
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
              console.log(product);         
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