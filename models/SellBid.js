
const mongoose = require('mongoose');
const BidSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }, 
});
const sellBid = mongoose.model('BuyBid', BidSchema);
module.exports = sellBid;