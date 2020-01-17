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
const Category = require('../models/Category');
const { check, validationResult } = require('express-validator');

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
router.get('/', ensureAuthenticated,permit('Admin'), admin_controller.dashboard);

// (req, res) => res.render('pages/admin/dashboard',{ layout:'admin-layout' }));
 router.get('/add-product', function(req, res, next) {
  Category.find({},function(err,category){
    res.render('pages/admin/add-product',{layout:'admin-layout',category:category}); 
    });
    
 });

router.get('/product/:id/edit', product_controller.editProduct);

router.post('/product/:id/update',ensureAuthenticated, permit('Admin'),product_controller.updateProduct);
 
router.post('/add-product',ensureAuthenticated,permit('Admin'),product_controller.saveProduct);
router.get('/buying',ensureAuthenticated, permit('Admin'),admin_controller.productsBuyBids);
router.get('/selling',ensureAuthenticated, permit('Admin'),admin_controller.productsSellBids);
//router.get('/admin/', ensureAuthenticated, (req, res) => res.render('pages/admin/dashboard',{ layout:'admin-layout' }));
//router.get('/admin/users', ensureAuthenticated, (req, res) => res.render('pages/admin/users',{ layout:'admin-layout' }));
//router.get('/admin/template-products', ensureAuthenticated, (req, res) => res.render('pages/admin/template-products',{ layout:'admin-layout' }));
router.get('/template-products/:page',ensureAuthenticated, permit('Admin'), product_controller.adminProducts);
router.get('/users',ensureAuthenticated, permit('Admin'),users_controller.listUsers);
router.post('/users',ensureAuthenticated, permit('Admin'),users_controller.updateUserStatus);

router.get('/orders/',ensureAuthenticated, permit('Admin'),admin_controller.allOrders);

router.get('/brand/:id',ensureAuthenticated, permit('Admin'), admin_controller.listBrands);
  router.post('/add-brand/',ensureAuthenticated,permit('Admin'), admin_controller.saveBrand);
  router.post('/brand/update',ensureAuthenticated, permit('Admin'),admin_controller.updateBrand);
  router.get('/brand/:id/delete',ensureAuthenticated, permit('Admin'), admin_controller.deleteBrand);
  router.post('/update-order/:id',ensureAuthenticated,permit('Admin'), admin_controller.updateOrderStatus);
  router.get('/category/',ensureAuthenticated, permit('Admin'), admin_controller.listCategory);
  router.post('/add-category/',ensureAuthenticated,permit('Admin'), admin_controller.saveCategory);
  router.post('/category/update',ensureAuthenticated, permit('Admin'),admin_controller.updateCategory);
  router.get('/category/:id/delete',ensureAuthenticated, permit('Admin'), admin_controller.deleteCategory);
module.exports = router;