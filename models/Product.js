
// - Importing Mongoose - \\
const mongoose = require('mongoose');
// * ------------- * \\
// - MongoDB Schema - \
// * ------------- * \\
// - Creating Schema for database - \\
const prodSchema = new mongoose.Schema({
 name: String,
 description: String,
 price: Number,
 image: String
});
// - Compiling mongoose Schema to a Model - \\
const Product = mongoose.model('Product', prodSchema);
// Exporting Products Model
module.exports = Product;