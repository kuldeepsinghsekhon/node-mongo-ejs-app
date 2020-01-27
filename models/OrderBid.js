const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema = new mongoose.Schema({
  product:{type: Schema.Types.ObjectId, ref: 'Product'}, //mongoose.Schema.Types.ObjectId {type: Schema.Types.ObjectId, ref: 'Product'},
  buyer:{type: Schema.Types.ObjectId, ref: 'User'},
  seller:{type: Schema.Types.ObjectId, ref: 'User'},
  sellbid:{type: Schema.Types.ObjectId, ref: 'SellBid'},
  buybid:{type: Schema.Types.ObjectId, ref: 'BuyBid'},
  //paymentId: {type: String, required: true},
 // payment: {type: Object, required: true},
  orderdate:{type: Date},
  netprice:Number,
  price:Number,
  status: String,
  ordertype: String,
  updated:Date,
  payment: {type: Object, required: true},
  SellerTransaction: {type: Schema.Types.ObjectId, ref: 'Transaction'},
  BuyerTransaction: {type: Schema.Types.ObjectId, ref: 'Transaction'},
});
const OrderBid = mongoose.model('OrderBid', OrderSchema);
module.exports = OrderBid;