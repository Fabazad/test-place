const constants = require("../helpers/constants");

const mongoose = require('mongoose');

const categoryValues = constants.PRODUCT_CATEGORIES.map(category => category.value);

const amazonSellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
    asin: { type: String, required: true, unique: true},
    title: { type: String, required: true, index: true },
    price: { type: Number, required: true, index: true },
    finalPrice: { type: Number, required: true },
    description: { type: String, required: true},
    isPrime: { type: Boolean, required: true, index: true },
    beforeNote: String,
    afterNote: String,
    maxDemands: { type: Number, required: true },
    automaticAcceptance: { type: Boolean, required: true, index: true },
    imageUrls: { type: [String], required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    category: { type: String, enum: categoryValues, required: true, index: true },
    createdAt: { type: Date, default: new Date(), required: true, index: true },
    amazonSeller: { type: amazonSellerSchema },
    published: { type: Boolean, required: true, default: true },
    publishDate: { type: Date, default: Date.now() }
});

productSchema.index({'title': 'text'});

module.exports = mongoose.model('Product', productSchema);