const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema = new mongoose.Schema({
  product:{type: Schema.Types.ObjectId, ref: 'Product'}, //mongoose.Schema.Types.ObjectId {type: Schema.Types.ObjectId, ref: 'Product'},
  buyer:{type: Schema.Types.ObjectId, ref: 'User'},
  seller:{type: Schema.Types.ObjectId, ref: 'User'},
  sellbid:{type: Schema.Types.ObjectId, ref: 'SellBid'},
  buybid:{type: Schema.Types.ObjectId, ref: 'BuyBid'},
  orderdate:{type: Date},
  netprice:Number,
  status: String,
  updated:Date,
});
const OrderBid = mongoose.model('OrderBid', OrderSchema);
module.exports = OrderBid;