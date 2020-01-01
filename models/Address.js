const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },lastname:{
    type: String
  },
  organisation_name: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: true
  },
  state:{
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  address1:{
    type: String,
    required: true
  },
  address2:{
    type: String,
  },
  postalCode:{
    type: Number,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  address_type:{type:String, required:true}
});

const Address = mongoose.model('Address', AddressSchema);
module.exports = Address;