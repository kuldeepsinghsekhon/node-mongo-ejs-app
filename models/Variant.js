
const mongoose = require('mongoose');
const prodSchema = new mongoose.Schema({
 name: String,
 department:String,
 brand: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Brand' 
  }, 
 description: String,
 category: String, //sneekers/addidas/yeezee/model
 sku: Number,
 price: Number,
 style:String,
 image: String,
//specs: Map,
Condition:String,
 attrs:[{
    name: String,
    value: String
}] ,
  images:[{ 
   type: mongoose.Schema.Types.ObjectId, 
     ref: 'Image' //multiple image 
  }],
shipping : {
    dimensions: {
        height: mongoose.Decimal128,
        length: mongoose.Decimal128,
        width: mongoose.Decimal128
    },
    weight: mongoose.Decimal128
},

});
const Product = mongoose.model('Product', prodSchema);

module.exports = Product;