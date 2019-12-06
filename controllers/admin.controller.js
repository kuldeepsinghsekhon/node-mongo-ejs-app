//let c= await Address.countDocuments(filter);
const Attribute = require('../models/Attribute');
/*brand controller */
const Brand = require('../models/Brand');
exports.listBrands=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Brand
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, brand) {
            Brand.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/admin/brand', {
                    brands: brand,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'admin-layout'
                })
            })
        })
  }
module.saveAttribute=function name(req,res) {
    
}