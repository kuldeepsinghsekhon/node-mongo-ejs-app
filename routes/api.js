const express = require('express');
const passport = require('passport');
const {ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { permit } = require('../config/role-auth');
const router = express.Router();
const settings_controller = require('../controllers/settings.controller');
const product_controller = require('../controllers/api.product.controller');
const auth_controller = require('../controllers/auth.controller');

router.post('/products/',passport.authenticate(['basic'], { session : false }),product_controller.products);
router.get('/products/:id',forwardAuthenticated, product_controller.findById );
router.get('/products/sell/:id',ensureAuthenticated, product_controller.sellProductVariant );
router.post('/products/sell/:id/',ensureAuthenticated, product_controller.sellAsk );
router.post('/products/cal',ensureAuthenticated, product_controller.sellCalculateCharges);
router.get('/products/sell/:id/pay',ensureAuthenticated, product_controller.sellProductOrAsk );
router.post('/products/sell/:id/pay',ensureAuthenticated, product_controller.sellProductPay );
router.get('/products/buy/:id',ensureAuthenticated, product_controller.buyProductVariant );
router.post('/products/buy/:id/',ensureAuthenticated, product_controller.placeBuyBid );
router.post('/products/calcbuy',ensureAuthenticated, product_controller.calculateBuyCharges);
router.post('/user/settings/resetpsword',passport.authenticate('basic', { session : false }),settings_controller.requestResetPassword);
router.post('/change_password',passport.authenticate('basic', { session : false }), auth_controller.updateChangePassword);

module.exports = router;