const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
  thoroughfare:{
    type: String,
    required: true
  },
  locality:{
    type: String,
  },
  premise:{
    type: String,
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