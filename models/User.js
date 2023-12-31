const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    //required: true
  },
  username: {
    type: String,
    //required: true
  },
  email: {
    type: String,
   
  },
  password: {
    type: String,
   
  },
  role:{
    type: String,
    required: true
  },
  status: 
  {
    type :Boolean,
    default:'true'
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
  cardtoken:String,
  fbid:String,
  googleId:String,
  //notifications:{type: Schema.Types.ObjectId, ref: 'UserNotification'},
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
