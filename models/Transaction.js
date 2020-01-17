const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const transactionSchema = new mongoose.Schema({ 
  BidPrice:Number,
  TransactionFee  : Number,
  ProcessingFee  : Number,
  ShippingFee  : Number,
  DiscountCode :String,
  TotalPayout :Number,
  TradeDate: Date,
  Settlement :Date,
  Payment: {type: Object},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  sellbid: {type: Schema.Types.ObjectId, ref: 'SellBid'},
  order: {type: Schema.Types.ObjectId, ref: 'OrderBid'},
  status:String,
  BidType:String
});
const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;