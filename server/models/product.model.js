const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    asin: { type: String, required: true, unique: true},
    title: { type: String, required: true },
    price: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    description: { type: String, required: true},
    isPrime: { type: Boolean, required: true },
    beforeNote: String,
    afterNote: String,
    maxDemands: { type: Number, required: true },
    automaticAcceptance: { type: Boolean, required: true }
});

module.exports = mongoose.model('Product', productSchema);