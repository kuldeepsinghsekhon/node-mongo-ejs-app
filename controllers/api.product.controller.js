const braintree = require("braintree");
const Product = require('../models/Product');
const SellBid = require('../models/SellBid');
const BuyBid = require('../models/BuyBid');
const Address = require('../models/Address');
const Attribute = require('../models/Attribute');
const Category = require('../models/Category');
const OrderBid = require('../models/OrderBid');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');
exports.products = function(req, res, next) {
    var perPage = 9;
    var page = req.body.page || 1;
    Product
        .find({})
        .skip((perPage * page) - perPage)
        .populate({path:'sellbids',
        match: { status: 'ask' }
        ,options: {
          limit: 1,
          sort: { bidprice: +1}        
     } })
     .limit(perPage)
        .exec(function(err, products) {
            Product.count().exec(function(err, count) {
                if (err) return next(err)
               // console.log(products);
                res.json({success:'ok',
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    
                })
            })
        })
  }
  exports.productsByCategory = function(req, res, next) {
    var perPage = 9;
    var category_slug=req.params.category_slug;

    var page = req.params.page || 1;
    Product
        .find({category:category_slug})
        .skip((perPage * page) - perPage)
        .populate({path:'sellbids',
        match: { status: 'ask' }
        ,options: {
          limit: 1,
          sort: { bidprice: +1}        
     } })
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
    Promise.all([
      Product.findOne({ _id: productId }).populate({path:'attrs'}),
      SellBid.findOne({productid:productId,status:'ask'}).sort({bidprice:+1}).limit(1),
      BuyBid.findOne({productid:productId,status:'buybid'}).sort({bidprice:-1}).limit(1),
      OrderBid.find({ product: productId }).sort({orderdate:-1}).limit(10),
      OrderBid.count({ product: productId}),
      Product.find({ }).limit(10),
    ]).then( ([ product, sellbid,highbid,lastsale,ordercount,relatedproducts]) => {
     // console.log("lastsale");
    //  console.log(lastsale);
      var allsales=lastsale;
      var spchange=0;
     var highsale;
      if(lastsale.length>1){
     spchange=lastsale[0].netprice-lastsale[1].netprice;
     highsale=lastsale[0];
      }
      if(lastsale.length>0){

        highsale=lastsale[0];
         }
      res.render('pages/public/product-detail', {
        product: product,
        lowbid:sellbid,
        highbid:highbid,
        layout:'layout',
        spchange:spchange,
        lastsale:highsale,
        allsales:allsales,
        ordercount:ordercount,
        relatedproducts:relatedproducts
       
       })
      });

  //   product=Product.findById(productId,function(err,product){         
  //   //   res.render('pages/public/sell-product-variant', {
  //   //     product: product,
  //   //     layout:'layout'
  //   // })
  //       res.render('pages/public/product-detail', {
  //         product: product,
  //         layout:'layout'
  //     })
  // })
}
/*********** select Product Variant ***************/
exports.sellProductVariant= async function(req, res, next) {
  var productId=req.params.id;//productId:productId
  req.session.oldUrl='/products/'+productId;
  Promise.all([
    Product.findOne({ _id: productId }).populate({path:'attrs'}),
    SellBid.findOne({productid:productId,status:'ask'}).sort({bidprice:+1}).limit(1),
    BuyBid.findOne({productid:productId,status:'buybid'}).sort({bidprice:-1}).limit(1)
  ]).then( ([ product, sellbid,highbid ]) => {
    res.render('pages/public/product-sellorask', {
      product: product,
      lowbid:sellbid,
      highbid:highbid,
      layout:'layout'
     })
   // console.log( product );
    //console.log( sellbid );
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
    //  console.log(bid);
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
exports.sellCalculateCharges=async function(req, res, next) {
   var productId=req.body.id;
   
   Promise.all([
    Product.findOne({ _id: productId }).populate({path:'attrs'}),
    BuyBid.findOne({productid:productId,status:'buybid'}).sort({bidprice:-1}).limit(1),
  ]).then( ([product,highbid])=>{
    var askprice=0; 
      if(!req.body.askprice){
        askprice=highbid.bidprice;
        
       }else{
        askprice=parseInt(req.body.askprice);
        var expiry=req.body.expiry;
        expiry=expiry.split("Days").map(Number);       
       // console.log(expiry[0]);
       }
     var TransactionFee=askprice*0.09;
     var Proc=askprice*0.03;
     var Shipping=30;
     var totalpayout=askprice-(TransactionFee+Proc+Shipping);
     //console.log(askprice);
      res.json({ TransactionFee: TransactionFee.toFixed(2) ,Proc:Proc.toFixed(2),Shipping:Shipping.toFixed(2),discountcode:'',totalpayout:Math.ceil(totalpayout) });
      
  })

    // product=Product.findById(productId,function(err,product){
    //   var askprice=0; 
     
    //   if(!req.body.askprice){
    //     askprice=product.price;
    //    }else{
    //     askprice=req.body.askprice;
    //     var expiry=req.body.expiry;
    //     expiry=expiry.split("Days").map(Number);       
    //    // console.log(expiry[0]);
    //    }
    //  var TransactionFee=askprice*0.09;
    //  var Proc=askprice*0.03;
    //  var Shipping=30;
    //  var totalpayout=askprice-(TransactionFee+Proc+Shipping);
    //   res.json({ TransactionFee: TransactionFee ,Proc:Proc,Shipping:Shipping,discountcode:'',totalpayout:totalpayout });
     
  // })
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
            //console.log(clientToken);
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
  var bidprice=0;//req.body.bidprice;
  var buybid=await BuyBid.findOne({productid:productId,status:'buybid'}).sort({bidprice:-1}).limit(1);
 var lowestask=await SellBid.findOne({productid:productId,status:'ask'}).sort({bidprice:+1}).limit(1);
  var prod=await Product.findById(productId).populate('selbids');
  sellBid.productid = req.body.productid;
 
  sellBid.user = req.user;//Date.now()
  sellBid.biddate=Date.now();
  sellBid.title=prod.name;
  if(buybid!=null){
    sellBid.highestbid=buybid.bidprice;
  }
if(lowestask!=null){
  sellBid.lowestask=lowestask.bidprice;
}

  var expiry=req.body.expiry;
  expiry=expiry.split("Days").map(Number);  
  var expire= parseInt(expiry[0])    
  //console.log(expiry[0]);
  sellBid.expire=Date.now() + ( 3600 * 1000 * 24*expire)
  if(req.body.bidType=='sale'){
    sellBid.status="sale";
    
    bidprice=buybid.bidprice;
  }else{
    sellBid.status="ask";
    bidprice=req.body.bidprice;
  }
  sellBid.bidprice = bidprice;
  //sellBid.save();
  let sellbids=[];
  var TransactionFee=bidprice*0.09;
  var Proc=bidprice*0.03;
  var Shipping=30;
  var totalcharges=Math.ceil(TransactionFee+Proc+Shipping);
  //console.log('total chrges'+totalcharges);
  //console.log('bidprice'+bidprice);

 prod.sellbids.push(sellBid);
 
 // console.log(prod);
  //console.log(sellBid);
  //console.log('sellBid');
  var nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  var newTransaction = gateway.transaction.sale({
    amount: totalcharges,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, function(error, result) {
      if (result) {
        if(req.body.bidType=='sale'){
          const order=new OrderBid();
          buybid.status='buy';
        order.seller=req.user;
        order.buyer=buybid.user;
        order.buybid=buybid;
        order.sellbid=sellBid;
        order.product=prod;
        order.status='Won Bid';
        order.netprice=bidprice;//need to add buying charges
        order.save();
        buybid.save();
        }
        sellBid.save();
       
        prod.save();
        
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
    SellBid.findOne({productid:productId,status:'ask'}).sort({bidprice:+1}).limit(1),
    BuyBid.findOne({productid:productId,status:'buybid'}).sort({bidprice:-1}).limit(1),
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
   // console.log( sellbid );
  });
}
exports.placeBuyBid=async function name(req,res,next) {
  //console.log('fdggdgf');
  const buyBid = new BuyBid();

  var bidprice=0;
  const productId= req.body.productid;
  var sellask=await SellBid.findOne({productid:productId,status:'ask'}).sort({bidprice:+1}).limit(1);
  var highestbid=await BuyBid.findOne({productid:productId,status:'buybid'}).sort({bidprice:-1}).limit(1);

  var prod=await Product.findById(productId).populate('buybids');
  if(highestbid){
    buyBid.highestbid = highestbid.bidprice;
  }
  if(sellask){
    buyBid.lowestask = sellask.bidprice;
  }
  buyBid.productid = req.body.productid;
  buyBid.bidprice = req.body.bidprice;
  

  buyBid.user = req.user
  buyBid.biddate=Date.now();//Date.now() + ( 3600 * 1000 * 24)
  var expiry=req.body.expiry;
        expiry=expiry.split("Days").map(Number);  
        var expire= parseInt(expiry[0])    
        //console.log(expiry[0]);
  buyBid.expire=Date.now() + ( 3600 * 1000 * 24*expire)
  buyBid.title=prod.name;
  console.log('bidtype'+req.body.bidType);
  
  if(req.body.bidType=='buy'){
    buyBid.status="buy";   
    bidprice=sellask.bidprice;
  }else{
    buyBid.status="buybid";
    bidprice=parseInt(req.body.bidprice);
  }
  buyBid.bidprice = bidprice;
   
  var processingFee=bidprice*0.09;
     var authenticationFee=bidprice*0.03;
     var shipping=30;
     var totalpay=bidprice+(processingFee+authenticationFee+shipping);
  var totalcharges=Math.ceil(totalpay);
//  console.log('total chrges'+totalcharges);
 // console.log('bidprice'+bidprice);
  //let buybids=[];
//  var prod=await Product.findById(productId).populate('buybids');
//  prod.buybids.push(buyBid);
//   prod.save();
 // console.log(prod);
 // console.log(buyBid);
  //console.log('buyBid');
  var nonceFromTheClient = req.body.paymentMethodNonce;
  
  // Create a new transaction for $10
  var newTransaction = gateway.transaction.sale({
    amount: totalcharges,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, function(error, result) {
      if (result) {
       // sellask.status='sale';
       if(req.body.bidType=='buy'){  
        const order=new OrderBid();    
        sellask.status="sale";
        bidprice=sellask.bidprice;
        order.sellbid=sellask;
        order.seller=sellask.user;
        //buyBid.sellbid=sellask;
        order.buybid=buyBid;
        order.buyer=req.user;
        order.netprice=totalpay;
        order.product=prod;
        order.status='Order Placed';
        order.orderdate=Date.now();
        order.save();
        sellask.save();      
      }     
        //orderdate
        buyBid.save();       
          prod.buybids.push(buyBid);
           prod.save();
         
        res.send(result);
       // console.log(result);
      } else {
        res.status(500).send(error);
      }

  });
  
}
exports.calculateBuyCharges=function name(req,res,next) {
  var productId=req.body.id;
  Promise.all([
    Product.findOne({ _id: productId }).populate({path:'attrs'}),
    SellBid.findOne({productid:productId,status:'ask'}).sort({bidprice:+1}).limit(1),
  ]).then( ([product,lowestbid])=>{
    var askprice=0; 
      if(!req.body.askprice){
        askprice=lowestbid.bidprice;
        
       }else{
        askprice=parseInt(req.body.askprice);
        var expiry=req.body.expiry;
        expiry=expiry.split("Days").map(Number);       
        //console.log(expiry[0]);
       }
     var processingFee=askprice*0.09;
     var authenticationFee=askprice*0.03;
     var shipping=30;
     var totalpay=askprice+(processingFee+authenticationFee+shipping);
     //console.log(askprice);
      res.json({ processingFee: processingFee.toFixed(2) ,authenticationFee:authenticationFee.toFixed(2),shipping:shipping.toFixed(2),discountcode:'',totalpay:Math.ceil(totalpay) });
      
  })
  // product=Product.findById(productId,function(err,product){
  //  var askprice=0; 
  //  if(!req.body.askprice){
  //    askprice=product.price;
  //   }else{
  //    askprice=req.body.askprice;
  //    var expiry=req.body.expiry;
  //    expiry=expiry.split("Days").map(Number);
  //    console.log(expiry[0]);
  //   }
  //   var processingFee=askprice*0.09;
  //   var Proc=askprice*0.03;
  //   var Shipping=30;
  //   var totalpayout=askprice-(processingFee+Proc+Shipping);
  //  res.json({ TransactionFee: processingFee ,Proc:Proc,Shipping:Shipping,discountcode:'',totalpayout:totalpayout });
  //  })
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
exports.buyBidPay=async  function(req, res,next){
 
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
    product.releasedate = req.body.releasedate;
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
    if (!req.body.category_name || !req.body.product_description || !req.body.product_name 
      || !req.body.product_price||!req.files|| Object.keys(req.files).length=== 0  ) {
      errors.push({ msg: 'Please enter all Required fields' });
     
      if(!req.files){
        errors.push({ msg: 'Please upload image' });
      }
    }
  
    // if (password != password2) {
    //   errors.push({ msg: 'Passwords do not match' });
    // }
  
    if (errors.length > 0) {
    
       Category.find({},function(err,category){
        
         res.render('pages/admin/add-product',{layout:'admin-layout',category:category,errors:errors}); 

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
      let productImage1 = req.files.productImage;
      imgname=Date.now()+path.extname(req.files.productImage.name);
      productImage1.mv(imgpath+'//'+imgname, function(err) { 
        if (err) throw err
        //return res.status(500).send(err);
        //res.send('File uploaded!');}
      });        
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
      exports.findByIdChart=function(req, res, next) {
        var productId=req.params.id; 
        Promise.all([
         OrderBid.find({ product: productId },{ orderdate: 1, netprice: 1, _id:0 }).sort({orderdate:-1}),  
        ]).then( ([lastsale]) => {
          var resarr=[];
          for(i=0;i<lastsale.length;i++){
            resarr.push([lastsale[i].orderdate,lastsale[i].netprice]);  
          }
          //   var spchange=0;
          // var highsale;
          //   if(lastsale.length>0){
          // spchange=lastsale[0].netprice-lastsale[1].netprice;
          // highsale=lastsale[0];
          res.json(resarr);//.toJSON();
  
        });
     }  
     exports.showSellSearch=function name(req,res,next) {
     
     
          res.render('pages/public/sellsearch', {
            category:[],
            layout:'layout'
        })
   
       
     }
     exports.sellProductSearchReasult=async function(req, res, next) {
      //var productId=req.body.id;
      Product
        .find({})
        //.skip((perPage * page) - perPage)
       // .populate({path:'sellbids'
        //,options: {
         // limit: 1,
         // sort: { bidprice: +1}        
     //} })
     //.limit(perPage)
     .select({ "name": 1, "_id": 1,image:1})
        .exec(function(err, products) {
            Product.count().exec(function(err, count) {
                if (err) return next(err)
               // console.log(products);
               var resarr=[];
          for(i=0;i<products.length;i++){
            //resarr.push(products[i].name,products[i].image);  
          }
               res.json( products);

            })
        })
         
     }