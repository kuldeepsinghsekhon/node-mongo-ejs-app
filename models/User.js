const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  shoesize:Number,
  currency:String,
  paypalEmail:String,
  validated:Boolean,
  token:String,
  braintreeid:String,
  notifications:{type: Schema.Types.ObjectId, ref: 'UserNotification'},
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
