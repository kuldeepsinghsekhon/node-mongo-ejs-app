const express = require('express');
const router = express.Router();
const payments_controller = require('../controllers/payments.controller');
router.get('/saveinfo-stripe-standard',forwardAuthenticated,payments_controller.saveinfoStripeStandard);
module.exports = router;