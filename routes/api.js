const express = require('express');
const passport = require('passport');
const {ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { permit } = require('../config/role-auth');
const router = express.Router();
const settings_controller = require('../controllers/settings.controller');
const product_controller = require('../controllers/api.product.controller');
const auth_controller = require('../controllers/auth.controller');
const utils_controller = require('../controllers/utils.controller');
router.post('/products/',forwardAuthenticated,product_controller.products);
router.post('/latestBids/',forwardAuthenticated,product_controller.latestBids);
router.post('/buying/',forwardAuthenticated,product_controller.ajaxproductBuying);
router.post('/buying_product/',forwardAuthenticated,product_controller.place_buy);
router.post("/client_token", product_controller.braintreeClientToken);
router.get('/products/:id',forwardAuthenticated, product_controller.findById );
router.get('/products/sell/:id',ensureAuthenticated, product_controller.sellProductVariant );
router.post('/products/sell/:id/',ensureAuthenticated, product_controller.sellAsk );
router.post('/products/cal',ensureAuthenticated, product_controller.sellCalculateCharges);
router.get('/products/sell/:id/pay',ensureAuthenticated, product_controller.sellProductOrAsk );
router.post('/products/sell/:id/pay',ensureAuthenticated, product_controller.sellProductPay );
router.get('/products/buy/:id',ensureAuthenticated, product_controller.buyProductVariant );
router.post('/products/buy/:id/',ensureAuthenticated, product_controller.placeBuyBid );
router.post('/products/calcbuy',ensureAuthenticated, product_controller.calculateBuyCharges);
router.post('/user/settings/resetpsword',passport.authenticate('local', { session : false }),settings_controller.requestResetPassword);
router.post('/change_password',passport.authenticate('local', { session : false }), auth_controller.updateChangePassword);
router.post('/settings/profile',passport.authenticate('local', { session : false }), settings_controller.saveProfile);
router.get('/countries',forwardAuthenticated, utils_controller.allCoutries);
router.post('/settings/seller-info',passport.authenticate('local', { session : false }), settings_controller.saveSellerInfo);
router.post('/settings/shipping-info',passport.authenticate('local', { session : false }), settings_controller.saveShippingInfo);
router.post('/settings/buyer-info',passport.authenticate('local', { session : false }), settings_controller.saveBuyerInfo);
router.post('/settings/address-info',passport.authenticate('local', { session : false }), settings_controller.addressInfo);
router.post('/sign-in',passport.authenticate(['local']),auth_controller.signIn);
router.get('/brand',forwardAuthenticated, utils_controller.brand);
router.post('/products/detail',forwardAuthenticated, product_controller.findSingleProduct );
router.post('/banner',forwardAuthenticated,product_controller.viewBanner);
router.post('/asks',forwardAuthenticated,product_controller.allAsks);
router.post('/lowestask', forwardAuthenticated, product_controller.newLowestAsk);
router.post('/allbids',forwardAuthenticated, product_controller.allBid);
router.post('/allsale',forwardAuthenticated, product_controller.allSale);
module.exports = router;