
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BidSchema = new mongoose.Schema({
  productid:String, // {type: Schema.Types.ObjectId, ref: 'Product'},
  bidprice:Number,
  status: String,
  biddate:{type: Date},
  updated:Date,
  user:{type: Schema.Types.ObjectId, ref: 'User'},
});
const SellBid = mongoose.model('sellBid', BidSchema);
module.exports = SellBid;