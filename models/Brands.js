const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    img: { 
        type: mongoose.Schema.Types.ObjectId, 
     ref: 'Image' //multiple image 
    },
    name: String
});
const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;