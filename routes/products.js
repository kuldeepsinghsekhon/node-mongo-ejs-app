const express = require('express');

const router = express.Router();
const product_controller = require('../controllers/product.controller');
const {ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
/* List All Products */
router.get('/',forwardAuthenticated,product_controller.products);

/* product detail page Next Page is /shop/id/ */
router.get('/:id',forwardAuthenticated, product_controller.findById );
/* product Sell-Select Variant page */

router.get('/sell/:id/variant',forwardAuthenticated, product_controller.sellProductVariant );
router.get('/sell/:id/:vid',ensureAuthenticated, product_controller.sellProductOrAsk );
router.post('/sell/:id/',ensureAuthenticated, product_controller.sellAsk );
module.exports = router;