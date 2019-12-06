const mongoose = require('mongoose');

const AttributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  attrs:[String]
});
const Attribute = mongoose.model('Attribute', AttributeSchema);

module.exports = Attribute;