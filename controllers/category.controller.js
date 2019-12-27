const Brand = require('../models/Category');
// exports.adminProducts=function(req, res, next) {
//     var perPage = 9;
//     var page = req.params.page || 1;
//     Product
//         .find({})
//         .skip((perPage * page) - perPage)
//         .limit(perPage)
//         .exec(function(err, products){
//             Product.count().exec(function(err, count) {
//                 if (err) return next(err)
//                 res.render('pages/admin/template-products', {
//                     products: products,
//                     current: page,
//                     pages: Math.ceil(count / perPage),
//                     layout:'admin-layout'
//                 })
//             })
//         })
//   }