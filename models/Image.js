const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    
    src:String,
    order:Number
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;