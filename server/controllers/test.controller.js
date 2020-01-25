const constants = require("../helpers/constants");

const TestModel = require('../models/test.model');
const ProductModel = require('../models/product.model');
const ErrorResponses = require("../helpers/ErrorResponses");

class TestController {

    static async create(testData, userId) {
        return new Promise(async (resolve, reject) => {
            const product = await ProductModel.findById(testData.product);
            if (!product) {
                return reject({status: 400, message: "Couldn't find product."});
            }
            if (product.remainingRequests < 1) {
                return reject({status: 400, message: "Not enough remaining requests on this product."})
            }
            if (product.seller.toString() === userId) {
                return reject({status: 400, message: "You can't test your own product."})
            }
            testData.tester = userId;
            testData.seller = product.seller.toString();
            testData.status = constants.TEST_STATUSES.requested;
            testData.createdAt = new Date();
            testData.updates = [{date: new Date(), status: constants.TEST_STATUSES.requested}];
            const test = new TestModel(testData);

            test.save()
                .then(res => {
                    product.remainingRequests--;
                    product.save()
                        .then(() => resolve(test))
                        .catch(err => ErrorResponses.mongoose(err))
                })
                .catch(err => {
                    if (err.code === 11000) {
                        reject({status: 400, message: 'Un produit avec le même identifiant ASIN existe déjà.'});
                    }
                    reject(ErrorResponses.mongoose(err));
                });
        });
    }
}

module.exports = TestController;


