var express = require('express');
var router = express.Router();
var braintree = require('braintree');
var paypal = require('paypal-rest-sdk');
const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BraintreeMerchantId,       //merchant id 
  publicKey: process.env.BraintreePublicKey,        //public key
  privateKey: process.env.BraintreePrivateKey //private key 
});
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PaypalClientId,
  'client_secret': process.env.PaypalClientSecret
});
router.post('/paypal', function(req, res, next) {
 
  // Use the payment method nonce here
  var nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  var newTransaction = gateway.transaction.sale({
    amount: '23.00',
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, function(error, result) {
      if (result) {
        res.send(result);
      } else {
        res.status(500).send(error);
      }
  });
});
router.post('/hosted', function(req, res, next) {
    
    // Use the payment method nonce here
    var nonceFromTheClient = req.body.paymentMethodNonce;
    // Create a new transaction for $10
    var newTransaction = gateway.transaction.sale({
      amount: '55.23',
      paymentMethodNonce: nonceFromTheClient,
      options: {
        // This option requests the funds from the transaction
        // once it has been authorized successfully
        submitForSettlement: true
      }
    }, function(error, result) {
        if (result) {
          res.send(result);
        } else {
          res.status(500).send(error);
        }
    });
  });
  router.get('/testbt', function(req, res, next) {
    
    // Use the payment method nonce here
    var nonceFromTheClient = req.body.paymentMethodNonce;
    // Create a new transaction for $10
    var newTransaction = gateway.transaction.sale({
      amount: '18.88',
      //customerId: 530712991,
      paymentMethodToken:'mtb7j62',
      options: {
        // This option requests the funds from the transaction
        // once it has been authorized successfully
        submitForSettlement: true
      }
    }, function(error, result) {
        if (result) {
          res.send(result);
        } else {
          res.status(500).send(error);
        }
    });
  });
module.exports = router;