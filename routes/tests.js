const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Mailtest
router.get('/mailtest', forwardAuthenticated, (req, res) => res.send('mailtest'));

module.exports = router;