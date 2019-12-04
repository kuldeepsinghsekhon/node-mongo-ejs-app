const mongoose = require('mongoose');

const specSchema = new mongoose.Schema({
        name: String,
        value:String
});
const Specification = mongoose.model('Brand', specSchema);
module.exports = Specification;