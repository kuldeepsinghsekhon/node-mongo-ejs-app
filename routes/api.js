const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/api.product.controller');
const {ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
router.post('/products/',forwardAuthenticated,product_controller.products);
router.get('/products/:id',forwardAuthenticated, product_controller.findById );
router.get('/products/sell/:id',ensureAuthenticated, product_controller.sellProductVariant );
router.post('/products/sell/:id/',ensureAuthenticated, product_controller.sellAsk );
router.post('/products/cal',ensureAuthenticated, product_controller.sellCalculateCharges);
router.get('/products/sell/:id/pay',ensureAuthenticated, product_controller.sellProductOrAsk );
router.post('/products/sell/:id/pay',ensureAuthenticated, product_controller.sellProductPay );
router.get('/products/buy/:id',ensureAuthenticated, product_controller.buyProductVariant );
router.post('/products/buy/:id/',ensureAuthenticated, product_controller.placeBuyBid );
router.post('/products/calcbuy',ensureAuthenticated, product_controller.calculateBuyCharges);

module.exports = router;