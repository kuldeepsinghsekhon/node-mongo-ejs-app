const express = require('express');

const router = express.Router();
const product_controller = require('../controllers/product.controller');
const {ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
/* List All Products */
router.get('/',forwardAuthenticated,product_controller.products);

/* product detail page Next Page is /shop/id/ */
router.get('/:id',forwardAuthenticated, product_controller.findById );
router.post('/detail',forwardAuthenticated, product_controller.findProductAjax );

/* product Sell-Select Variant page */

router.get('/sell/:id',ensureAuthenticated, product_controller.sellProductVariant );
router.post('/sell/:id/',ensureAuthenticated, product_controller.sellAsk );
//router.post('/sell/:id',forwardAuthenticated, product_controller.sellProductVariantNowPay);
router.post('/cal',ensureAuthenticated, product_controller.sellCalculateCharges);
router.get('/sell/:id/pay',ensureAuthenticated, product_controller.sellProductOrAsk );
router.post('/sell/:id/pay',ensureAuthenticated, product_controller.sellProductPay );

router.get('/buy/:id',ensureAuthenticated, product_controller.buyProductVariant );
router.post('/buy/:id/',ensureAuthenticated, product_controller.placeBuyBid );
router.post('/calcbuy',ensureAuthenticated, product_controller.calculateBuyCharges);
router.post('/buy/billingshiping/form',ensureAuthenticated, product_controller.buyBillingShipping);
router.post('/buy/shipping/shippingform',ensureAuthenticated, product_controller.buyShipping);
router.post('/bids/:productId',forwardAuthenticated,product_controller.productBids);
router.post('/asks/:productId',forwardAuthenticated,product_controller.productSells);
//router.post('/buy/shipping/pay',ensureAuthenticated, product_controller.buyProductPay );

module.exports = router;