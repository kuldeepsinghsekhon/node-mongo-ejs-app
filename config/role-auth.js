module.exports = {permit: function(...allowed) {
    const isAllowed = role => allowed.indexOf(role) > -1;
    
    // return a middleware
    return (request, response, next) => {
      if (request.user && isAllowed(request.user.role))
        next(); // role is allowed, so continue on the next middleware
      else {
        response.status(403).render('pages/public/sign-in',{
            message: "Forbidden: You are not authorize to see requested page",
            layout:'layout'
          }); // user is forbidden
      }
    }
  }
}