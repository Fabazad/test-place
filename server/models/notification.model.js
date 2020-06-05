const {NOTIFICATION_TYPES} = require("../helpers/constants");
const mongoose = require('mongoose');
const productModel = require("../models/product.model");
const testModel = require("../models/test.model");

const productObject = Object.assign({}, productModel.schema.obj);

productObject.asin.unique = false;
Object.keys(productObject).forEach(key => {
    productObject[key].index = false;
});

const testObject = Object.assign({}, testModel.schema.obj);
Object.keys(testObject).forEach(key => {
    testObject[key].index = false;
});


const notificationObject = {
    product: new mongoose.Schema(productObject),
    test: new mongoose.Schema(testObject),
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    type: {type: String, enum: Object.values(NOTIFICATION_TYPES), required: true},
    createdAt: {type: Date, default: Date.now, required: true},
    viewDate: {type: Date, default: null}
};

const TestModel = mongoose.model('Notification', notificationObject);

module.exports = TestModel;