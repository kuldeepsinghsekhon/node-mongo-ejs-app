const mongoose = require('mongoose');
const countrySchema = new mongoose.Schema({ 
  Name : String,
  Code:String,
});
const Country = mongoose.model('Country', countrySchema);
module.exports = Country;