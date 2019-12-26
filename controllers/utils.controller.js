const nodemailer = require('nodemailer');
exports.sendmymail=function(mailOptions){
    const transporter = nodemailer.createTransport({
    host: 'in-v3.mailjet.com',
    port: 587,
    requireTLS: true,
    auth: {
        user: 'a63f9f06d525f9ec6270729a89704cfe',
        pass: '34a8564fc34463f7563679c4efc34bee'
    }
  });
  
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });  
  }