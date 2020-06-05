const {NOTIFICATION_TYPES} = require("../helpers/constants");
const mongoose = require('mongoose');
const productModel = require("../models/product.model");
const testModel = require("../models/test.model");

const notificationObject = {
    product: productModel.schema,
    test: testModel.schema,
    user: {type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User'},
    type: {type: String, enum: Object.values(NOTIFICATION_TYPES), required: true},
    createdAt: {type: Date, default: new Date(), required: true},
    viewDate: {type: Date, default: null}
};

const TestModel = mongoose.model('Notification', notificationObject);

module.exports = TestModel;