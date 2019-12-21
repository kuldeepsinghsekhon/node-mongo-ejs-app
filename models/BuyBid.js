const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BidSchema = new mongoose.Schema({
  productid:String, //mongoose.Schema.Types.ObjectId {type: Schema.Types.ObjectId, ref: 'Product'},
  bidprice:Number,
  status: String,
  biddate:{type: Date},
  updated:Date,
  user:{type: Schema.Types.ObjectId, ref: 'User'},
  sellbid:{type: Schema.Types.ObjectId, ref: 'SellBid'},
});
const BuyBid = mongoose.model('BuyBid', BidSchema);
module.exports = BuyBid;