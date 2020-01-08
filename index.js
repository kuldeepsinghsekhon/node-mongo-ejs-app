const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const expressValidator = require('express-validator');
var parser = require('body-parser');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const mongoStore = require('connect-mongo')(session);
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(fileUpload());
const path = require('path');
global.appRoot = path.resolve(__dirname);
//global.appHost = app.http;
const nodemailer = require('nodemailer');
// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: false }));
// app.use(expressValidator({
//   errorFormatter: function(param, msg, value) {
//   var namespace = param.split('.')
//   , root = namespace.shift()
//   , formParam = root;
  
//   while(namespace.length) {
//   formParam += '[' + namespace.shift() + ']';
//   }
//   return {
//   param : formParam,
//   msg : msg,
//   value : value
//   };
//   }
//   }));
// Express session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store:new mongoStore({mongooseConnection:mongoose.connection}),
    cookie:{maxAge:180*60*1000}
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.session = req.session;
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/api', require('./routes/api.js'));
app.use('/user', require('./routes/user.js'));
app.use('/admin', require('./routes/admin.js'));
app.use('/products', require('./routes/products.js'));
app.use('/email', require('./routes/email.js'));
app.use('/shop', require('./routes/shop.js'));
app.use('/payments', require('./routes/payments.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

