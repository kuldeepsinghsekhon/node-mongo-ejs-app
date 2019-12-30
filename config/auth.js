const Category = require('../models/Category');
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    Category.find({},function(error,category){
      //console.log(category)
      res.locals.category = category;
      });
    if (req.isAuthenticated()) {
      res.locals.role = req.user.role;
      res.locals.name = req.user.name;
      res.locals.paypalEmail = req.user.paypalEmail; 
      return next();  
      if(!validated){
        req.flash('error_msg', 'Please Check tour email  and Validate Account');
        res.redirect('/sign-in');
      }
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/sign-in');
  },
  forwardAuthenticated: function(req, res, next) {
    Category.find({},function(erro,category){
     // console.log(category)
      res.locals.category = category;
      });
    if (!req.isAuthenticated()) {
      res.locals.name = 'guest';
      res.locals.role = '';
    }else{
      res.locals.role = req.user.role;
      res.locals.name = req.user.name; 
      res.locals.paypalEmail = req.user.paypalEmail; 
    }
    return next();
    //res.redirect('/');      
  }
};

