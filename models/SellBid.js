
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BidSchema = new mongoose.Schema({
  productid:String, // {type: Schema.Types.ObjectId, ref: 'Product'},
 title:String,
  bidprice:Number,
  status: String,
  biddate:{type: Date},
  updated:Date,
  expire:Date,
  lowestask:Number,
  highestbid:Number,
  user:{type: Schema.Types.ObjectId, ref: 'User'},
  attr_val:String
});
const SellBid = mongoose.model('sellBid', BidSchema);
module.exports = SellBid;