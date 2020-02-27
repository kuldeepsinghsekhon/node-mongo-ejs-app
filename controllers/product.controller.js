const Product = require('../models/Product');
const SellBid = require('../models/SellBid');
const BuyBid = require('../models/BuyBid');
const Address = require('../models/Address');
const Attribute = require('../models/Attribute');
const Category = require('../models/Category');
const OrderBid = require('../models/OrderBid');
const Country = require('../models/Country');
const Brand = require('../models/Brand');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');
var uniqueFilename = require('unique-filename');
const uniqueString = require('unique-string');
const braintree = require("braintree");
var paypal = require('paypal-rest-sdk');
const gateway = braintree.connect({
  
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BraintreeMerchantId,       //merchant id 
  publicKey: process.env.BraintreePublicKey,        //public key
  privateKey: process.env.BraintreePrivateKey //private key 
});
const BuyProcessingFee= process.env.BuyProcessingFee;
const BuyAuthenticationFee = process.env.BuyAuthenticationFee;
const BuyShipping = process.env.BuyShipping;

const TransactionFeeCharge=process.env.TransactionFeeCharge;

const  SellProcessingCharge=process.env.SellProcessingCharge;

const SellShipping=process.env.SellShipping;

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PaypalClientId,
  'client_secret': process.env.PaypalClientSecret
});

exports.viewAddProduct = function(req, res, next) {
  Promise.all([
  Brand.find({}),
  Category.find({}),
  ]).then( ([ brand,category]) => {
    
    res.render('pages/admin/add-product', { layout:'admin-layout', brand:brand,category:category}); 
    });
  }
exports.products = function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
    Product.find({active:'true'}).skip((perPage * page) - perPage).populate({path:'sellbids', //20/1/20
        match: { status: 'ask' }
        ,options: {
          limit: 1,
          sort: { bidprice: +1}        
     } }).limit(perPage).exec(function(err, products) {
            Product.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/public/home', {
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  }
  exports.productsByCategory = function(req, res, next) {
    var perPage = 9;
    var category_slug=req.params.category_slug;
console.log(category_slug);
    var page = req.params.page || 1;
    Promise.all([
      Product.find({category:category_slug, active:'true'}) 
      .skip((perPage * page) - perPage) 
      .populate({path:'sellbids',
      match: { status: 'ask' }
      ,options: {
        limit: 1,
        sort: { bidprice: +1}  ,
   } }),
      Brand.find({}),
     ]).then( ([ products,brand,]) => {
      Product.count().exec(function(err, count) {
       if (err) return next(err)
      res.render('pages/public/products', {
        products: products,
        current: page,
        pages: Math.ceil(count / perPage),
        brand:brand,
        layout:'layout'
        
    })
  })

  })
    // Product.find({category:category_slug, active:'true'})
    //     .skip((perPage * page) - perPage)
    //     .populate({path:'sellbids',
    //     match: { status: 'ask' }
    //     ,options: {
    //       limit: 1,
    //       sort: { bidprice: +1}  ,
            
    //  } })
    //  .limit(perPage)
    //     .exec(function(err, products) {
    //         Product.count().exec(function(err, count) {
    //             if (err) return next(err)
    //             console.log(products);
    //             res.render('pages/public/products', {
                  
    //                 products: products,
    //                 current: page,
    //                 pages: Math.ceil(count / perPage),
    //                 layout:'layout'
    //             })
    //         })
    //     })
  }


exports.category_product = function(req,res,next){
  var category_filter = JSON.parse(req.body.category_filter);
  var brand_filter = JSON.parse(req.body.brand_filter) ;
  console.log(category_filter);
  console.log(brand_filter)
  // console.log(typeof brand_filter);
  // var brandObj = new Object();
  // brand_filter.forEach(function(item){
  //   brandObj.brand = item;
  // });
  // console.log(brandObj.brand);
  var query={};
  if((brand_filter.length>0) && (category_filter.length>0)){
    query={brand:brand_filter,category:category_filter};
    console.log(brand_filter.length);
    console.log(category_filter.length);
    console.log('Both Brand And Category');
  }else if(brand_filter.length>0)
  {
    query = {brand:brand_filter};
    console.log('Only Brand');
  }else
  {
    query = {category:category_filter};
    console.log('Only Category');
}
  Product.find(query).exec(function(err, product){  
    if(err) return next(err)
    console.log("Check Brand");
    console.log(product);
    // res.json(product);
   res.json(JSON.stringify(product))
  })
  // console.log(category_filter);
}

  exports.findById=function(req, res, next) {
    var productId=req.params.id;
    req.session.oldUrl='/products/'+productId;
    Promise.all([
      Product.findOne({ _id: productId }).populate({path:'attrs'}),
      SellBid.findOne({productid:productId,status:'ask'}).sort({bidprice:+1}).limit(1),
      OrderBid.find({product:productId}),
      BuyBid.findOne({productid:productId,status:'buybid'}).sort({bidprice:-1}).limit(1),
      OrderBid.find({ product: productId }).sort({orderdate:-1}).limit(10),
      OrderBid.findOne({ product: productId }).sort({netprice:+1}).limit(1),
      OrderBid.findOne({ product: productId }).sort({netprice:-1}).limit(1),
     // Product.findOne({ _id: productId }),
      OrderBid.count({ product: productId}),
      Product.find({active:'true' }).limit(10),
    ]).then( ([ product, sellbid,sellBid_avg,highbid,lastsale,lowest_netprice,heigh_netprice,ordercount,relatedproducts]) => {
      //console.log(lastsale[0].netprice);
      //console.log(product);
      var avg_retail_price=0;
      if(lastsale.length>0){
        var pricepremium=lastsale[0].netprice-product.price;
      }
      //console.log(pricepremium);
      var avg_retail_price = ((pricepremium/product.price)*100).toFixed(2);
    // console.log(avg_retail_price); 
      var addtotal = 0 ;
      for(var i = 0; i< sellBid_avg.length ; i++ ) {
        var addtotal = addtotal+sellBid_avg[i].netprice;
       }
       
         var avg = parseInt(addtotal/sellBid_avg.length);
         //console.log(avg);
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
         console.log(product.id);
      res.render('pages/public/product-detail', {
        product: product,
        lowbid:sellbid,
        highbid:highbid,
        lowest_netprice:lowest_netprice,
        heigh_netprice:heigh_netprice,
        //product_details:product_details,
        avg_retail_price:avg_retail_price,
        avg:avg,
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

  });

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
      res.json({ bid:bid});
    }); 
  })

}

/*********** Product Sell Or Ask  ***************/
// const gateway = braintree.connect({
//   environment: braintree.Environment.Sandbox,
//   merchantId: "dwt5m34ppngz6s7k",       //merchant id
//   publicKey: "g2d976m7dxpt6bx5",        //public key
//   privateKey: "117df9268ade2b95fc3f526966441059" //private key
// });
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
   var productId=req.body.id.replace(" ","");
   var attrv=req.body.attr_val.replace(" ","");
   //console.log(attrv);
  // console.log(productId);
   Promise.all([
    Product.findOne({ _id: productId }).populate({path:'attrs'}),
    BuyBid.findOne({productid:productId,status:'buybid',attr_val:attrv}).sort({bidprice:-1}).limit(1),
    SellBid.findOne({productid:productId,status:'ask',attr_val:attrv}).sort({bidprice:+1}).limit(1),
  ]).then( ([product,highbid,lowestask])=>{
    //console.log(highbid);
    var askprice=0; 
      if(!req.body.askprice){
        if(highbid)
        askprice=highbid.bidprice;
        
       }else{
        askprice=parseInt(req.body.askprice);
        var expiry=req.body.expiry;
        expiry=expiry.split("Days").map(Number);       
       }
     var TransactionFee=askprice*TransactionFeeCharge;
     var Proc=(askprice*SellProcessingCharge);
     var Shipping=parseInt(SellShipping);
     var totalpayout=askprice-(TransactionFee+Proc+Shipping);
     var price=product.price;
     var message='You must meet the minimum Ask of '+price;
    if(product.pricetrigger && askprice<=price){
      res.json({status:'error',data:{ TransactionFee: TransactionFee.toFixed(2) ,Proc:Proc.toFixed(2),Shipping:Shipping,discountcode:'',totalpayout:Math.ceil(totalpayout)},message:message });
    }else{
      var lowestaskprice=(lowestask!=null?lowestask.bidprice:0);
      var hightestbidprice=(highbid!=null? highbid.bidprice:0);
      if(askprice>=lowestaskprice&&lowestaskprice!=0){
        message='You are not the lowest ask';
      }else if(askprice>hightestbidprice){
        message='You are about to be the lowest ask';
      }else if(askprice<=hightestbidprice&&hightestbidprice!=0){
        message='You are about to sell at the highest Bid price';
      }    
      res.json({status:'success',data:{TransactionFee: TransactionFee.toFixed(2) ,Proc:Proc.toFixed(2),Shipping:Shipping,discountcode:'',totalpayout:Math.ceil(totalpayout)},message:message });
    }
      
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
            res.render('pages/public/product-sellorask', {
              product: product,
              clientToken:clientToken,
              layout:'layout'
          })
           // console.log(err);
          });      
        }
      })
}
exports.sellProductPay=function(req,res){
  var productId=req.body.id;
  Promise.all([
    Product.findOne({ _id: productId }).populate({path:'attrs'}), 
  Address.findOne({address_type:'billing',user:req.user}).limit(1),
  Country.find({}),
  ]).then( ([ product,address,countries ]) =>
  {
      if(address==null)address=new Address();
      res.render('pages/public/product-sell-payment', {
        product: product,
        address: address,
        countries:countries,
        layout:'blank-layout' });
      });
}

exports.sellAsk=async  function(req, res,next){
  var name = req.body.name;
  var lastname=req.body.lastname;
  var email=req.user.email;
  var sellBid = new SellBid();
  var transaction = new Transaction();
  var attr_val= req.body.attr_val;
  const productId= req.body.productid;
  var bidprice=0;//req.body.bidprice;
  var buybid=await BuyBid.findOne({productid:productId,status:'buybid'}).sort({bidprice:-1}).limit(1);
 var lowestask=await SellBid.findOne({productid:productId,status:'ask'}).sort({bidprice:+1}).limit(1);
  var prod=await Product.findById(productId).populate('selbids');
  sellBid.productid = req.body.productid;
  sellBid.user = req.user;//Date.now()
  sellBid.biddate=Date.now();
  sellBid.title=prod.name;
  sellBid.attr_val=attr_val;
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
    if(buybid){
      bidprice=buybid.bidprice;
    }
  }else{
    sellBid.status="ask";
    bidprice=req.body.bidprice;
  }
  sellBid.bidprice = bidprice;
  //sellBid.save();
  let sellbids=[];
  var TransactionFee=bidprice*parseInt(TransactionFeeCharge);
  var Proc=bidprice*parseInt(SellProcessingCharge);
  var Shipping=parseInt(SellShipping);
  var totalcharges=Math.ceil(TransactionFee+Proc+Shipping);
  transaction.TransactionFee=TransactionFee;
  transaction.processingFee=Proc;
  transaction.ShippingFee=Shipping;
  transaction.TotalCharges=totalcharges;
  //transaction.TradeDate=Date.now;
  transaction.user=req.user;
  transaction.status='NotStarted';
  transaction.BidType='ask';
  ////////////
  sellBid.TransactionFee=TransactionFee;
  sellBid.processingFee=Proc;
  sellBid.ShippingFee=Shipping;
  sellBid.TotalCharges=totalcharges;
  sellBid.brand = prod.brand;
  console.log(sellBid.brand);
  ////////////////
 prod.sellbids.push(sellBid);
  var nonceFromTheClient = req.body.paymentMethodNonce;
  var braintreeid=req.user.braintreeid;
  if(!braintreeid){
    customer=  await gateway.customer.create({
      firstName: name,
      lastName: lastname,
      email: email,
    }).catch((error)=>console.log(error));
    var c=customer.customer;
    braintreeid=customer.customer.id;//408993133;
     User.findByIdAndUpdate(req.user._id, {$set:{braintreeid:braintreeid}},{new: true}, function (err, user) {
      });
  }

  var billingAddress={streetAddress: "New Street Address",
  postalCode: "60622",options: { updateExisting: true }};
  var creditCard={}; 
  var cardtoken=req.user.cardtoken;
  if(!cardtoken){
    creditCard={billingAddress:billingAddress };
  }else{
    creditCard={
       options: { updateExistingToken: cardtoken },
       billingAddress:billingAddress
     };
  }

  var newTransaction = gateway.customer.update(braintreeid,{
    //amount: totalcharges,
    paymentMethodNonce: nonceFromTheClient,
    email: email,
    creditCard:creditCard,
    
  }, function(error, result) {
    cardtoken=result.customer.paymentMethods[0].token;
     //console.log(cardtoken+'fsadfasdfsad');
      if (result) {
        if(req.body.bidType=='sale'){
          const order=new OrderBid();
        buybid.status='buy';
        order.seller=req.user;
        order.buyer=buybid.user;
        order.buybid=buybid;
        order.brand = prod.brand;
        order.sellbid=sellBid;
        order.product=prod;
        order.status='Won Bid';
        order.netprice=bidprice;//need to add buying charges
        transaction.sellbid=sellBid;
        order.SellerTransaction=transaction;
        
        order.save();
        buybid.save();
        }
        transaction.save();
        sellBid.save();
       
        prod.save();
        cardtoken=result.customer.paymentMethods[0].token;
       // console.log(result.customer.paymentMethods);
        User.findByIdAndUpdate(req.user._id, {$set:{cardtoken:cardtoken}},{new: true}, function (err, user) {    
         });

        res.send(result);
       
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
    Address.findOne({address_type:'billing',user:req.user}).limit(1),
    Country.find({}),
  ]).then( ([ product, sellbid,highbid,shippingAddress,billingAddress,countries ]) => {
    if(shippingAddress==null) shippingAddress = new Address();
    if(billingAddress==null) billingAddress = new Address();
    res.render('pages/public/product-buyorbid', {
      product: product,
      lowbid:sellbid,
      highbid:highbid,
      shippingAddress:shippingAddress,
      billingAddress:billingAddress,
      countries:countries,
      layout:'layout'
     })
  });
}
exports.placeBuyBid=async function name(req,res,next) {
  const buyBid = new BuyBid();
  var bidprice=0;
  const productId= req.body.productid;
  var attr_val= req.body.attr_val;
  var first_name_shipping = req.body.first_name_shipping;
  var last_name_shipping = req.body.last_name_shipping;
  var address_shipping= req.body.address_shipping;
  var address2_shipping = req.body.address2_shipping;
  var city_shipping = req.body.city_shipping;
  var state_shipping = req.body.state_shipping;
  var country_code_shipping = req.body.country_code_shipping;
  var postalCode_shipping = req.body.postalCode_shipping;
  var telephone_shipping = req.body.telephone_shipping;
  var first_name_billing = req.body.first_name_billing;
  var last_name_billing = req.body.last_name_billing;
  var address_billing = req.body.address_billing;
  var address2_billing = req.body.address2_billing;
  var city_billing = req.body.city_billing;
  var state_billing = req.body.state_billing;
  var country_code_billing = req.body.country_code_billing;
  var postalCode_billing = req.body.postalCode_billing;
  var telephone_billing = req.body.telephone_billing;
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
  buyBid.attr_val=attr_val;
  buyBid.brand = prod.brand;
  console.log(buyBid.brand);

  buyBid.user = req.user
  buyBid.biddate=Date.now();//Date.now() + ( 3600 * 1000 * 24)
  var expiry=req.body.expiry;
        expiry=expiry.split("Days").map(Number);  
        var expire= parseInt(expiry[0])    
  buyBid.expire=Date.now() + ( 3600 * 1000 * 24*expire)
  buyBid.title=prod.name;
  
  if(req.body.bidType=='buy'){
    buyBid.status="buy";   
    bidprice=sellask.bidprice;
   
  }else{
    buyBid.status="buybid";
    bidprice=parseInt(req.body.bidprice);
  }
  buyBid.bidprice = bidprice;
   
  var processingFee=bidprice*BuyProcessingFee;
     var authenticationFee=bidprice*BuyAuthenticationFee;
     var shipping=BuyShipping;
     var totalpay=parseInt(bidprice)+(parseInt(processingFee)+parseInt(authenticationFee)+parseInt(shipping));
     console.log(totalpay);
  var totalcharges=(totalpay);
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
  var newTransaction = gateway.transaction.sale({
    amount: totalcharges,
    paymentMethodNonce: nonceFromTheClient,
    billing: {
      firstName: first_name_billing,
      lastName: last_name_billing,
      company: "",
      streetAddress: address_billing,
      extendedAddress: address2_billing,
      locality: city_billing,
      region: state_billing,
      postalCode: postalCode_billing,
      countryCodeAlpha2: country_code_billing
    },
    shipping: {
      firstName: first_name_shipping,
      lastName: last_name_shipping,
      company: "",
      streetAddress: address_shipping,
      extendedAddress: address2_shipping,
      locality: city_shipping,
      region: state_shipping,
      postalCode: postalCode_shipping,
      countryCodeAlpha2: country_code_shipping
    },
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, function(error, result) {
      if (result) {
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
        order.payment = result;
        order.orderdate=Date.now();
        order.save();
        sellask.save();      
      }     
        buyBid.save();       
          prod.buybids.push(buyBid);
           prod.save();
        // console.log(result);
        res.send(result);
      } else {
        res.status(500).send(error);
      }

  });
  
}
exports.calculateBuyCharges=function name(req,res,next) {
  var productId=req.body.id.replace(" ","");
   var attrv=req.body.attr_val.replace(" ","");
   console.log('bid type'+req.body.bidType);
  Promise.all([
    Product.findOne({ _id: productId }).populate({path:'attrs'}),
    SellBid.findOne({productid:productId,status:'ask',attr_val:attrv}).sort({bidprice:+1}).limit(1),
  ]).then( ([product,lowestask])=>{
    var askprice=0; 
       if(req.body.bidType=='buy'){
          if(lowestask){
            askprice=lowestask.bidprice;
          }else{
            askprice=0;
          }         
       }else{
        askprice=parseInt(req.body.bidprice);
        var expiry=req.body.expiry;
        expiry=expiry.split("Days").map(Number);       
       }    
     var processingFee=askprice*BuyProcessingFee;
     var authenticationFee=askprice*BuyAuthenticationFee;
     var shipping=parseInt(BuyShipping);
     var totalpay=askprice+(processingFee+authenticationFee+shipping);
      res.json({ processingFee: processingFee.toFixed(2) ,authenticationFee:authenticationFee.toFixed(2),shipping:shipping,discountcode:'',totalpay:Math.ceil(totalpay)});
      
  }).catch(err => console.log(err));
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
  Promise.all([
    Product.findOne({ _id: productId }).populate({path:'attrs'}),
    Address.findOne({address_type:'shipping',user:req.user}).limit(1),
    Address.findOne({address_type:'billing',user:req.user}).limit(1),
    Country.find()
  ]).then( ([ product,shippingAddress,billingAddress, countries ]) => {
        if(shippingAddress==null) shippingAddress = new Address();
    if(billingAddress==null) billingAddress = new Address(); 
    res.render('pages/public/product-buy-billing-shipping', {
      product: product,
      shippingAddress:shippingAddress,
      billingAddress:billingAddress,
      countries:countries,
      layout:'blank-layout'
     })
  });
}
exports.buyShipping=function(req,res){
  var productId=req.body.id;
Address.findOne({address_type:'shipping',user:req.user},
Country.find(),
function(err,address,countries){ 
  if (err) throw err
  if(Address==null)address = new address();
      res.render('pages/public/product-buy-shipping-info', {
        address: address,
        countries:countries,
        layout:'layout' });
      });
}
exports.buyBidPay=async  function(req, res,next){
 
  }
/*************Buy and BuyBid End **************/
exports.adminProducts=function(req, res, next) {
    Product
        .find({})
        .exec(function(err, products){
            Product.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/admin/template-products', {
                    products: products,
                    layout:'admin-layout'
                })
            })
        })
  }

/* admin can add Product */
exports.saveProduct=function(req, res, next) {
//  var testdata = req.files.productImage[0];
//   console.log(testdata);
    var product = new Product();
    var imgname='default.jpg';
    product.category = req.body.category_name;
    product.releasedate = req.body.releasedate;
    product.description = req.body.product_description;
    product.name = req.body.product_name;
    product.sku = req.body.product_sku;
    product.price = req.body.product_price; 
    product.style = req.body.style; 
    product.brand = req.body.brand_name;
    console.log(product.brand);
    product.active = 'false';
    if(req.body.status)
    {
      product.active = req.body.status;
    }
    let attributes;
    if(req.body.attributename){

      const attributename=req.body.attributename;
      const attributevalues=req.body.attributevalues;
      
    //  for(var i = 0; i < attributename.length;i++){
       var attribute= new Attribute();
       attribute.name=attributename;
       attribute.attrs=attributevalues.split('|');
       attribute.save();
      //  attributes.push(attribut);
      // }
      product.attrs = attribute; 
    }
  
    let errors = [];
    if (!req.body.category_name || !req.body.product_description || !req.body.brand_name || !req.body.product_name 
      || !req.body.product_price||!req.files|| Object.keys(req.files).length=== 0  ) {
      errors.push({ msg: 'Please enter all Required fields' });
      if(!req.files){
        errors.push({ msg: 'Please upload image' });
      }
    }
    if (errors.length > 0) {
       Category.find({},function(err,category){
         res.render('pages/admin/add-product',{layout:'admin-layout',category:category,errors:errors}); 

        });
    } else {
     // console.log(brand[0].name);
    
      
      var imgpath=appRoot+'//public//uploads//products//';
      console.log(imgpath);
    var mask=777;
      fs.mkdir(imgpath, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') console.log(null); // ignore the error if the folder already exists
            else console.log(err); // something else went wrong
        } else console.log(null); // successfully created folder
    });
    
   
      let sampleFile = req.files.productImage;
      imgname=Date.now()+path.extname(sampleFile.name);
      sampleFile.mv(imgpath+'//'+imgname, function(err) {
          if (err){
            console.log(err);
          }else{
            console.log(null);
          }
        });
product.image = imgname ;
console.log(product.image);
  //     if(sampleFile instanceof Array){
  //       console.log(sampleFile.length);
  //     var file_info = [];
  //     var count = 0;
  //     var imagename = [];
  //     sampleFile.forEach(function(ele, key) {


  //       imgname=Date.now()+path.extname(sampleFile.name);
  //       console.log(ele);
  //       file_info.push(imgname);

  //       ele.mv(imgpath+'//'+imgname, function(err) {
  //         if (err){
  //           console.log(err);
  //         }else{
  //           file_info.push(imgname);
  //         }
  //         count++;
         
  //         if(sampleFile.length == count){
            
  //         }
  //       });
      
  //     });
  //     var info = file_info.toString();
  //         //  console.log(info);
  // }
  
  //     // imgname=Date.now()+path.extname(req.files.productImage.name);
  //     // productImage1.mv(imgpath+'//'+imgname, function(err) { 
  //     //   if (err) throw err
  //     //   //return res.status(500).send(err);
  //     //   //res.send('File uploaded!');}
  //     // });        
    product.save(function(err,product) {
        if (err){
          throw err
        }
    
    });
    req.flash(
      'success_msg',
      'Product Addded Successfully'
    );
    res.redirect('/admin/add-product');
  }
  
}

exports.addimagesmultiple =   function(req, res, next)
{
   var productId = req.params.id;
  Product.findOne({ _id:productId}).exec(function(err,product)
  {
    var imgpath=appRoot+'//public//uploads//products//'+product.id;
    var mask = 777 ;
    fs.mkdir(imgpath, mask, function(err) {
      if (err) {
          if (err.code == 'EEXIST') console.log(null); // ignore the error if the folder already exists
          else console.log(err); // something else went wrong
      } else console.log(null); // successfully created folder
  });
var images_count = 0 ;

  if(images_count){
     var  images_count=  product.images.count;
  }

             
   let files = (req.files.file);
   console.log(files.length);  
   var imgupdatepath = [];

  files.forEach(function(ele, key){
  //var  imgname=Date.now()+path.extname(ele.name);
  var imgname =  'img'+images_count+'.png';;
    ele.mv(imgpath+'//'+imgname, function(err) { 
          if (err) throw err
         });
         imgupdatepath.push(imgname);
         images_count++ ; 
  });
  
  Product.findByIdAndUpdate(productId, {$set:{images:imgupdatepath}},{new: true},function(err,product){
    if (err) return next(err);
    res.redirect('/admin/template-products/');
});
  // prod={image:imgname};
  // // (product.image).push(imgupdatepath);//(imgupdatepath);
  // res.redirect('/admin/product/edit_image/'+productId);
});
}

exports.editImage = function name(req,res,next)
{

  
  var productId = req.params.id ;
  Product.findOne({_id:productId}).exec(function(err,product){
    //console.log(product.image);


  });

}

exports.addimages=function name(req,res,next) { 
  var productId = req.params.id;
  Product.findOne({_id:productId}).exec(function(err,product)
  {
    res.render('pages/admin/addimage', {
      product: product,
      layout:'admin-layout'
  })
});
}

/* View Page for admin can edit Product*/
exports.editProduct=function(req, res, next) {  
    var productId=req.params.id;
        product=Product.findById(productId)
        .populate({path:'attrs'}).exec(function(err,product)
          {
            res.render('pages/admin/edit-product', {
              product: product,
              layout:'admin-layout'
          })
      });
  }

  exports.deleteProduct=function(req, res, next) {
    var productId=req.params.id;
    Product.findByIdAndDelete({_id: productId }) .exec(function(err, products) {
      if(err) console.log(err)
    res.redirect('/admin/template-products/1');
  });
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
    product.pricetrigger = req.body.pricetrigger;
    product.pricetrigger = 'false';
    if(req.body.pricetrigger=='true')
    {
      product.pricetrigger = req.body.pricetrigger;
    }
    product.active = 'false';
    if(req.body.status=='true')
    {
      product.active = req.body.status;
    }

    //console.log(req.body.attributename);
    let attributes;
    if(req.body.attributevalues){

      const attributename=req.body.attributename;
      const attributevalues=req.body.attributevalues;
    //  for(var i = 0; i < attributename.length;i++){
       var attribute= new Attribute();
       attribute.name=attributename;
       attribute.attrs=attributevalues.split('|');
       attribute.save();
      //  attributes.push(attribut);
      // }
      product.attrs = attribute; 
    }
   
    var imgpath=appRoot+'//public//uploads//products//';
    var img='';
    var prod={name:req.body.product_name, active:product.active, pricetrigger:product.pricetrigger, description:req.body.product_description,category:req.body.category_name,sku:req.body.product_sku,price:req.body.product_price,style: req.body.style };
    if (!req.files || Object.keys(req.files).length=== 0) {
      //console.log('No files were uploaded.');
    }else{  
      let productImage1 = req.files.productImage;
        imgname=Date.now()+path.extname(req.files.productImage.name);
        productImage1.mv(imgpath+'//'+imgname, function(err) { 
          if (err) throw err

        });  
        prod={name:req.body.product_name,description:req.body.product_description,category:req.body.category_name,sku:req.body.product_sku,price:req.body.product_price,style: req.body.style,image:imgname };     
    }
    Product.findByIdAndUpdate(productId, {$set:prod}, function (err, product) {
            if (err) return next(err);
            res.redirect('/admin/template-products/');
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
        .find({active:'true'})
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
     exports.productBids =function(req,res,next){
       var productId= req.params.productId;
      BuyBid.find({productid:productId}).select({ "title": 1, "_id": 0,'bidprice': 1,'attr_val':1}).exec(function(err,bids){
        BuyBid.count().exec(function(err,count){
          if(err)return next(err);
        //  console.log(bids);
          res.json(bids)
        });
      });
  
     } 
     exports.productSells =function(req,res,next){
      var productId= req.params.productId;
     SellBid.find({productid:productId}).select({ "title": 1, "_id": 0,'bidprice': 1,'attr_val':1}).exec(function(err,asks){
       SellBid.count().exec(function(err,count){
         if(err)return next(err);
         res.json(asks)
         
       });
     });
 
    } 
    exports.findProductAjax=function(req, res, next) {
      var productId=req.body.productid;
      var attr_val=req.body.attr_val;
     // req.session.oldUrl='/products/'+productId;
      Promise.all([
        Product.findOne({ _id: productId }).populate({path:'attrs'}),
        SellBid.findOne({productid:productId,status:'ask',attr_val:attr_val}).sort({bidprice:+1}).limit(1),
        BuyBid.findOne({productid:productId,status:'buybid',attr_val:attr_val}).sort({bidprice:-1}).limit(1),
        OrderBid.find({ product: productId }).sort({orderdate:-1}).limit(3),
        OrderBid.count({ product: productId}),
        Product.find({ }).limit(10),
      ]).then( ([ product, lowask,highbid,lastsale,ordercount,relatedproducts]) => {
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
        res.json( {status:'success',data:{
          product: product,
          lowask:lowask,
          highbid:highbid,
          spchange:spchange,
          lastsale:highsale,
          allsales:allsales,
          ordercount:ordercount,
          relatedproducts:relatedproducts}
         
         })
        }).catch((error) => console.log(error));
      }
    
      exports.editBannerImg = function (req,res,next){

        var productId = req.params.id;
        Product.findOne({_id:productId},{images:'true'}).exec(function(err,product){
          if(err)return next(err);
          res.render('pages/admin/edit_banner_images', {
            product: product,
            layout:'admin-layout'

        });

      });
    }
    exports.updateeditBannerImg = function (req,res,next){
      
      productid = req.body.productid;
      Product.findOne({_id:productid},{images:'true'}).exec(function(err,product){

        var imgupdatepath = [];

        product.images.forEach(function(imgName_database, key){
          console.log(imgName_database);
          let imagename = req.files.newImage;
          var filename = req.body.filename;
        if(imgName_database==filename)
        {
          var imgpath=appRoot+'//public//uploads//products//'+product.id;
          imagename.mv(imgpath+'//'+filename, function(err) { 
                if (err) throw err
               });
               imgupdatepath.push(filename);
          }else{
            imgupdatepath.push(imgName_database);
          }
          
      });
      console.log(imgupdatepath);
      Product.findByIdAndUpdate(productid, {$set:{images:imgupdatepath}},{new: true},function(err,product){
        if (err) return next(err);
        res.redirect('/admin/template-products/');
    });
    });
  }

  exports.searchTest = function (req,res,next)
  {
    var search = req.body.check;
    console.log(search);
    Product.find( { name: { $regex: search, $options: "i" } } ).exec(function(err,docs){
      console.log(docs)
      res.json(docs);
    })
    // Product.find({ name: { $regex: search, $options: "i" }, active:'true' }, function(err, docs) {
    //   console.log("Partial Search Begins"); 
    //   console.log(docs);
    //   });
  }
 
 