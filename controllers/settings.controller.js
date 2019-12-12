const Address = require('../models/Address');
exports.settings=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Address
        .find({})
        .exec(function(err, users) {
            Address.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/users/setting', {
                    users: users,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  }
  exports.buyerInfo=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;

    Address
        .findOne({user:req.user,address_type:'billing'})
        .exec(function(err, users) {
            Address.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/users/settings-buyer-info', {
                    users: users,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  }
  exports.saveBuyerInfo=async function(req,res){
    const user=req.user;
    let address_type='billing';
    const { name, country,address1,address2, state, city,postalCode,phone} = req.body;
    let errors = [];
 
   if (!name || !country || !state || !city||!address1||!phone||!postalCode) {
     errors.push({ msg: 'Please enter all fields' });
   }
   if (name.length < 6) {
    errors.push({ msg: 'name must be at least 6 characters' });
  }
   if (country.length < 2) {
     errors.push({ msg: 'country must be at least 6 characters' });
   }
   if (state.length < 3) {
    errors.push({ msg: 'state must be at least 3 characters' });
  }
  if (city.length < 3) {
    errors.push({ msg: 'city must be at least 3 characters' });
  }
  if (address1.length < 3) {
    errors.push({ msg: 'address1 must be at least 3 characters' });
  }

  if (phone.length < 10) {
    errors.push({ msg: 'phone must be at least 10 characters' });
  }
    const update={name,country,state,city,address1,address2,phone,user,address_type};
    const  filter={user:user,address_type:address_type};
   
  // console.log(c);
   if (errors.length > 0) {
       console.log(errors);
    res.render('pages/users/settings-buyer-info', {
      errors,
      name, country,address1,address2, state, city,postalCode,phone
    });
  } else {
   let address=await  Address.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true // Make this update into an upsert
      });
      req.flash(
        'success_msg',
        'Billing/Buyer info saved successfully'
      );
      res.redirect('/user/setting');
      console.log(address);

  }
    
    // const doc = Address.findOne().exec(
    //     function(err,address){
    //         if(address){
    //             address.name='dfdsf';
    //             console.log('Address find');
    //             console.log(address);
    //             address.save();
    //            // Address.updateOne(req.body);
    //         }else{
    //             console.log('not found');
    //            var address= Address.create(update);
  
    //          console.log(address);
    //         }
      //  }
        
    //);
    //   Address.findByIdAndUpdate(productId, {$set:prod}, function (err, product) {
    //     if (err) return next(err);
    //     res.redirect('/admin/template-products/1');
    // });
  }
  exports.shippingInfo=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Address
        .find({})
        .exec(function(err, users) {
            Address.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/users/settings-shipping-info', {
                    users: users,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  }
  exports.saveShippingInfo=async function(req,res){
    const user=req.user;
  let address_type='billing';
  const { name, country,address1,address2, state, city,postalCode,phone} = req.body;
  let errors = [];

 if (!name || !country || !state || !city||!address1||!phone||!postalCode) {
   errors.push({ msg: 'Please enter all fields' });
 }
 if (name.length < 6) {
  errors.push({ msg: 'name must be at least 6 characters' });
}
 if (country.length < 2) {
   errors.push({ msg: 'country must be at least 6 characters' });
 }
 if (state.length < 3) {
  errors.push({ msg: 'state must be at least 3 characters' });
}
if (city.length < 3) {
  errors.push({ msg: 'city must be at least 3 characters' });
}
if (address1.length < 3) {
  errors.push({ msg: 'address1 must be at least 3 characters' });
}

if (phone.length < 10) {
  errors.push({ msg: 'phone must be at least 10 characters' });
}
  const update={name,country,state,city,address1,address2,phone,user,address_type};
  const  filter={user:user,address_type:address_type};
 
// console.log(c);
 if (errors.length > 0) {
     console.log(errors);
  res.render('pages/users/settings-shipping-info', {
    errors,
    name, country,address1,address2, state, city,postalCode,phone
  });
} else {
 let address=await  Address.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true // Make this update into an upsert
    });
    req.flash(
      'success_msg',
      'Shipping info saved successfully'
    );
    res.redirect('/user/setting');
    console.log(address);


    }
}
  exports.sellerInfo=function(req, res, next) {
    var perPage = 9;
    var page = req.params.page || 1;
  
    Address
        .find({})
        .exec(function(err, users) {
            Address.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('pages/users/settings-seller-info', {
                    users: users,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    layout:'layout'
                })
            })
        })
  }
 
    exports.saveSellerInfo=async function(req,res){
        const user=req.user;
      let address_type='seller';
      const { name,organisation_name, country,address1,address2, state, city,postalCode,phone} = req.body;
      let errors = [];
   
     if (!name || !organisation_name||!country || !state || !city||!address1||!phone||!postalCode||!phone) {
       errors.push({ msg: 'Please enter all fields' });
     }
     if (name.length < 6) {
      errors.push({ msg: 'name must be at least 6 characters' });
    }
    if (organisation_name.length < 3) {
        errors.push({ msg: 'organisation name must be at least 3 characters' });
      }
     if (country.length < 2) {
       errors.push({ msg: 'country must be at least 6 characters' });
     }
     if (state.length < 3) {
      errors.push({ msg: 'state must be at least 3 characters' });
    }
    if (city.length < 3) {
      errors.push({ msg: 'city must be at least 3 characters' });
    }
    if (address1.length < 3) {
      errors.push({ msg: 'address1 must be at least 3 characters' });
    }
  
    if (phone.length < 10) {
      errors.push({ msg: 'phone must be at least 10 characters' });
    }
      const update={name,organisation_name,country,state,city,address1,address2,phone,user,address_type};
      const  filter={user:user,address_type:address_type};
     
    // console.log(c);
     if (errors.length > 0) {
         console.log(errors);
      res.render('pages/users/settings-seller-info', {
        errors,
        name, country,address1,address2, state, city,postalCode,phone
      });
    } else {
     let address=await  Address.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true // Make this update into an upsert
        });
        req.flash(
          'success_msg',
          'Seller info saved successfully'
        );
        res.redirect('/user/setting');
        console.log(address);
  
    }
}
  exports.payoutInfo=function(req,res,next){
      res.render('pages/users/settings-payout-info')
  }
  
  exports.editProfile=function(req,res,next){
    res.render('pages/users/settings-profile')
}
exports.resetPassword=function(req,res,next){
    res.render('pages/users/settings-reset-password')
}