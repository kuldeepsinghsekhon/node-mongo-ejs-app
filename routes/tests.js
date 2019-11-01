const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aquatecinnovative1@gmail.com',
        pass: 'aquatec@321'
    }
  });
var mailOptions = {
    from: 'aquatecinnovative1@gmail.com',
    to: 'sekhon.game@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
// Mailtest
router.get('/mailtest', forwardAuthenticated, (req, res) => res.render('mailtest'));

module.exports = router;