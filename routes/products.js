const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/product.controller');
const {ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/',forwardAuthenticated,product_controller.products);
router.get('/:id',forwardAuthenticated, product_controller.findById );
module.exports = router;