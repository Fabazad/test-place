const constants = require("../helpers/constants");
const mongoose = require('mongoose');
const productModel = require("../models/product.model");
const moment = require("moment");

const updateObject = {
    date: {type: Date, required: true, default: new Date()},
    status: {type: String, enum: Object.values(constants.TEST_STATUSES), required: true}
};

const testObject = {
    product: productModel.schema,
    seller: {type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User'},
    tester: {type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User'},
    status: {type: String, enum: Object.values(constants.TEST_STATUSES), required: true},
    createdAt: {type: Date, default: new Date(), required: true, index: true},
    updates: {type: [updateObject], default: []},
    testerMessage: String,
    cancelRequestReason: String,
    declineRequestReason: String,
    sellerMessage: String,
    estimatedDeliveryDate: Date,
    declineReviewReason: String,
    expirationDate: { type: Date, default: moment().add(7, "days").toDate() }
};

const testSchema = new mongoose.Schema(testObject);

testSchema.pre('save', async function (next) {
    // Check if document is new or a new status has been set
    if (this.isNew || this.isModified('status')) {
        const document = this;
        document.updates.push({date: new Date(), status: document.status});
    }
    next();
});

testSchema.index({
    product: 1,
    tester: 1,
}, {
    unique: true,
});

const TestModel = mongoose.model('Test', testSchema);

module.exports = TestModel;