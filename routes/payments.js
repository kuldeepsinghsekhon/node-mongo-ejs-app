var express = require('express');
var router = express.Router();
var braintree = require('braintree');

router.post('/paypal', function(req, res, next) {
  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    // Use your own credentials from the sandbox Control Panel here
    merchantId: 'dwt5m34ppngz6s7k',
    publicKey: 'g2d976m7dxpt6bx5',
    privateKey: '117df9268ade2b95fc3f526966441059'
  });

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
      amount: '23.23',
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
module.exports = router;