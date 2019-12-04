const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const User = require('../models/User');
const Myorder = require('../models/Myorder');
const Cart = require('../models/Mycart');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { permit } = require('../config/role-auth');
const fileUpload = require('express-fileupload');
const product_controller = require('../controllers/product.controller');
const users_controller = require('../controllers/user.controller');
const admin_controller = require('../controllers/admin.controller');


const app = express();
app.use(fileUpload());
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb+srv://aquatec:'+encodeURIComponent('YDbEIGdQUcG2qcG0')+'@cluster0-frznk.mongodb.net/test?retryWrites=true&w=majority';


// Admin tool to directly run queries on database
router.get('/query-tool',function(req,res,next){
  MongoClient.connect(url, function(err, client) {
    if(err) {
      console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
 }
 console.log('Connected...');
 var db=client.db("test");

 const collection = db.collection("products");
//db.command();
  collection.find({}).toArray(function(err, docs) {
    console.log("Found the following records");
    console.log(docs)
    
  });
}); 
  res.render('pages/admin/query-tool',{layout:'admin-layout'})});
router.post('/query-tool',function(req,res,next){
  //  var obj =  Product.find({}).exec(function(err, products) {
  //   res.send(products);
  //  });

  res.send(obj);  
});
router.get('/dashboard', ensureAuthenticated,permit('Admin'), function(req, res){
  var usercount=User.count().exec();
  var productcount=Product.count().exec();
  res.render('dashboard', {
    usercount:usercount,
    productcount:productcount,
    user: req.user
  })
});
router.get('/', ensureAuthenticated,permit('Admin'),

function(req, res){
  var usercount=0;
    var productcount=0;
    productcount=Product.countDocuments();
    

  res.render('pages/admin/dashboard', {
   
    layout:'admin-layout',
    usercount:usercount,
    pcount:Product.countDocuments(),
    user: req.user
  })
});

// (req, res) => res.render('pages/admin/dashboard',{ layout:'admin-layout' }));
 router.get('/add-product', function(req, res, next) {
    res.render('pages/admin/add-product',{layout:'admin-layout'}); 
 });

router.get('/product/:id/edit', product_controller.editProduct);

router.post('/product/:id/update',ensureAuthenticated, permit('Admin'),product_controller.updateProduct);
 
router.post('/add-product',ensureAuthenticated, permit('Admin'),product_controller.saveProduct);


//router.get('/admin/', ensureAuthenticated, (req, res) => res.render('pages/admin/dashboard',{ layout:'admin-layout' }));
//router.get('/admin/users', ensureAuthenticated, (req, res) => res.render('pages/admin/users',{ layout:'admin-layout' }));
//router.get('/admin/template-products', ensureAuthenticated, (req, res) => res.render('pages/admin/template-products',{ layout:'admin-layout' }));
router.get('/template-products/:page',ensureAuthenticated, permit('Admin'), product_controller.adminProducts);
router.get('/users/:page',ensureAuthenticated, permit('Admin'),users_controller.listUsers);
router.get('/orders/:page',ensureAuthenticated, permit('Admin'), function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Myorder
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, orders) {
        Myorder.count().exec(function(err, count) {
            if (err) return next(err)
            var arr = [];
            var order_id = [];
            var payment = [];
            orders.forEach(order => {                 
                var cart= new Cart(order.cart);
            var products =cart.generateArray();
            arr.push(products); 
            order_id.push(order.id);
            payment.push(order.payment)
              }); 
            res.render('pages/admin/orders', {                  
                orders: arr,
                order_id:order_id,
                payment:payment,
                current: page,
                pages: Math.ceil(count / perPage),
                layout:'admin-layout'
            })
            //console.log(orders);
        })
    })
  });

  router.get('/brand/:id', admin_controller.listBrands);
module.exports = router;