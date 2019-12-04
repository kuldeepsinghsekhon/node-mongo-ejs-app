const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    height:  mongoose.Decimal128,
    src:String,
    width: mongoose.Decimal128
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;