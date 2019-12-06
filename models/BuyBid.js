const mongoose = require('mongoose');
const BidSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }, 
});
const BuyBid = mongoose.model('BuyBid', BidSchema);
module.exports = BuyBid;