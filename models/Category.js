const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({ 
  name : String,
  child:[String],
  link:String,
  parent : {type: mongoose.Schema.Types.ObjectId,  ref: 'Category'} ,
  sort :Number,
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;