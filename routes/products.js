const express = require('express');

const router = express.Router();
const product_controller = require('../controllers/product.controller');
const {ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
/* List All Products */
router.get('/',forwardAuthenticated,product_controller.products);

/* product detail page Next Page is /shop/id/ */
router.get('/:id',forwardAuthenticated, product_controller.findById );
/* product Sell-Select Variant page */

router.get('/sell/:id',ensureAuthenticated, product_controller.sellProductVariant );
//router.post('/sell/:id',forwardAuthenticated, product_controller.sellProductVariantNowPay);
router.post('/cal',ensureAuthenticated, product_controller.sellCalculateCharges);
router.get('/sell/:id/pay',ensureAuthenticated, product_controller.sellProductOrAsk );
router.post('/sell/:id/pay',ensureAuthenticated, product_controller.sellProductPay );
router.post('/sell/:id/',ensureAuthenticated, product_controller.sellAsk );
module.exports = router;