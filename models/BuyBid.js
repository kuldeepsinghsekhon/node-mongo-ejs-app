const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BidSchema = new mongoose.Schema({
  productid:String, //mongoose.Schema.Types.ObjectId {type: Schema.Types.ObjectId, ref: 'Product'},
  title:String,
  bidprice:Number,
  status: String,
  biddate:{type: Date},
  expire:Date,
  updated:Date,
  lowestask:Number,
  highestbid:Number,
  TransactionFee  : Number,
  ProcessingFee  : Number,
  ShippingFee  : Number,
  DiscountCode :String,
  TotalCharges :Number,
  user:{type: Schema.Types.ObjectId, ref: 'User'},
  sellbid:{type: Schema.Types.ObjectId, ref: 'SellBid'},
  attr_val:String,
  attr_name:String
});
const BuyBid = mongoose.model('BuyBid', BidSchema);
module.exports = BuyBid;