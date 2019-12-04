
const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({ 
  name : String,
  parent : {type: mongoose.Schema.Types.ObjectId,  ref: 'Category'} ,
  slug : String,
});
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;