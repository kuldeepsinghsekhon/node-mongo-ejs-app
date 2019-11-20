module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.role = req.user.role;
      res.locals.name = req.user.name;
      return next();  
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/sign-in');
  },
  forwardAuthenticated: function(req, res, next) {
    
    if (!req.isAuthenticated()) {
      res.locals.name = 'guest';
      res.locals.role = '';
    }else{
      res.locals.role = req.user.role;
      res.locals.name = req.user.name; 
    }
    return next();
    //res.redirect('/');      
  }
};

