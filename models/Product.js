const Attribute = require('../models/Attribute');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
 releasedate:Date,
 price: Number,
 style:String,
 image: String,
//specs: Map,
condition:String,
size:Number,
 attrs:[{ type: Schema.Types.ObjectId,
  ref: 'Attribute'
}] ,
  images:[{ 
   type: Schema.Types.ObjectId, 
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
variants:[{ 
  type: Schema.Types.ObjectId, 
    ref: 'Variant' //multiple image 
 }],
 sellbids:[{ type: Schema.Types.ObjectId,
  ref: 'sellBid'
}] ,
buybids:[{ type: Schema.Types.ObjectId,
  ref: 'BuyBid'
}] ,
});
const Product = mongoose.model('Product', prodSchema);

module.exports = Product;