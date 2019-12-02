
// - Importing Mongoose - \\
const mongoose = require('mongoose');
// * ------------- * \\
// - MongoDB Schema - \
// * ------------- * \\
// - Creating Schema for database - \\
const prodSchema = new mongoose.Schema({
 name: String,
 department:String,
 brand:String,
 description: String,
 category: String,
 sku: Number,
 price: Number,
 style:String,
 image: String,
 //  Details: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Detail' 
//   },
 Condition:String,
//  attrs: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Attr' //color,size etc 
//   },
//  images: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Image' //multiple image 
//   }
});
// - Compiling mongoose Schema to a Model - \\
const Product = mongoose.model('Product', prodSchema);
// Exporting Products Model
module.exports = Product;