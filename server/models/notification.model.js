const {NOTIFICATION_TYPES} = require("../helpers/constants");
const mongoose = require('mongoose');
const productModel = require("../models/product.model");
const testModel = require("../models/test.model");
const emailController = require("../controllers/email.controller");

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
    type: {type: String, enum: Object.values(NOTIFICATION_TYPES).map(notifType => notifType.value), required: true},
    createdAt: {type: Date, default: Date.now, required: true},
    viewDate: {type: Date, default: null}
};

const notificationSchema = new mongoose.Schema(notificationObject);


notificationSchema.post('save', async (doc) => {
    await emailController.sendNotificationMail(doc);
});

const TestModel = mongoose.model('Notification', notificationSchema);

module.exports = TestModel;