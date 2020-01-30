const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    image:String,
  /*  img: { 
        type: mongoose.Schema.Types.ObjectId, 
     ref: 'Image' //multiple image 
    },*/
    url: String,
    status:Boolean
});
const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;