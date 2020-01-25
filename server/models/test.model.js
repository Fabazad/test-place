const constants = require("../helpers/constants");

const mongoose = require('mongoose');

const updateObject = {
    date: { type: Date, required: true, default: new Date() },
    status: { type: String, enum: Object.values(constants.TEST_STATUSES), required: true }
};

const testObject = {
    product: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'Product'},
    seller: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    tester: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    status: { type: String, enum: Object.values(constants.TEST_STATUSES), required: true },
    createdAt: { type: Date, default: new Date(), required: true, index: true },
    updates: { type: [updateObject], default: [] }
};

const testSchema = new mongoose.Schema(testObject);

module.exports = mongoose.model('Test', testSchema);