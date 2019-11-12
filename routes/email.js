const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const transporter = nodemailer.createTransport({
    host: 'in-v3.mailjet.com',
    port: 587,
    requireTLS: true,
    auth: {
        user: 'a63f9f06d525f9ec6270729a89704cfe',
        pass: '34a8564fc34463f7563679c4efc34bee'
    }
  });
var mailOptions = {
    from: 'aquatecinnovative1@gmail.com',
    to: 'kuldeep.sekhon@aquatecinnovative.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
router.get('/', forwardAuthenticated, (req, res) =>{
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.render('mailtest');
  } );
  // Dashboard
  
  
  module.exports = router;