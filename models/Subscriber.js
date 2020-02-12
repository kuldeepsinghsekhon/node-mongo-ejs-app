const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bidschema  = new mongoose.Schema({
    email : String
});

const Subscriber = mongoose.model('Subscriber', Bidschema);

module.exports = Subscriber;