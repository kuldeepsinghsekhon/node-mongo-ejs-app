
const mongoose = require('mongoose');
// * ------------- * \\
// - MongoDB Schema - \
// * ------------- * \\
// - Creating Schema for database user settings- \\
const UsersettingSchema = new mongoose.Schema({
 user: {type: Schema.Types.ObjectId, ref: 'User'},
 stripe_user_id: String,
 stripe_access_token: String,
 stripe_refresh_token:String,
 paypal_id:String,
 billing: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  },
  Shipping: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  }

});
// - Compiling mongoose Schema to a Model - \\
const Usersetting = mongoose.model('Usersetting', UsersettingSchema);
// Exporting Products Model
module.exports = Usersetting;