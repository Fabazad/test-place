const constants = require("../helpers/constants");
const AuthHelpers = require("../helpers/AuthHelpers");
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');
const mongoose = require('mongoose');

//Authorization management
const AUTH = constants.AUTH_CONDITIONS;

const categoryValues = constants.PRODUCT_CATEGORIES.map(category => category.value);
const isSellerAuth = [ AUTH.IS_SELLER ];
const isSellerMutationAuth =  { create: isSellerAuth, update: isSellerAuth };
const basicProductAuth = { read: [ AUTH.ANY ], ...isSellerMutationAuth };

//Mongoose schema
const amazonSellerSchema = new mongoose.Schema({
    name: { type: String, required: true, auth: basicProductAuth },
    url: { type: String, required: true, auth: basicProductAuth }
});

const productObject = {
    asin: { type: String, required: true, unique: true, auth: basicProductAuth },
    title: { type: String, required: true, index: true, auth: basicProductAuth },
    price: { type: Number, required: true, index: true, auth: basicProductAuth },
    finalPrice: { type: Number, required: true, auth: basicProductAuth },
    description: { type: String, required: true, auth: basicProductAuth},
    isPrime: { type: Boolean, required: true, index: true, auth: basicProductAuth },
    maxDemands: { type: Number, required: true, auth: basicProductAuth },
    automaticAcceptance: { type: Boolean, required: true, index: true, auth: basicProductAuth },
    imageUrls: { type: [String], required: true, auth: basicProductAuth },
    seller: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User',
        auth: { create: isSellerAuth, update: [], read: [ AUTH.ANY ] }
    },
    category: { type: String, enum: categoryValues, required: true, index: true, auth: basicProductAuth },
    createdAt: { type: Date, default: Date.now, required: true, index: true,
        auth: { create: isSellerAuth, update: [], read: [ AUTH.ANY ] }
    },
    amazonSeller: { type: amazonSellerSchema, auth: { create: isSellerAuth, update: [], read: [ AUTH.ANY ]} },
    publishDate: { type: Date, default: Date.now(), auth: basicProductAuth },
    publishExpirationDate: { type: Date, auth: basicProductAuth },
    keywords: { type: [String], default: [] },
    privateNote: String
};

const productSchema = new mongoose.Schema(productObject);

productSchema.methods.updateAuth = function(userId, fields, userRole) {
    return AuthHelpers.update(userId, fields, userRole, productObject, this._doc);
};

productSchema.index({'title': 'text'});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);