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
                        reject({status: 400, message: 'Vous avez déjà fait une demande de test avec ce même produit.'});
                    }
                    reject(ErrorResponses.mongoose(err));
                });
        });
    }

    static async getStatuses() {
        return new Promise((resolve, reject) => {
            const statuses = constants.TEST_STATUSES;
            if (statuses && Object.values(statuses).length > 0) {
                resolve(statuses);
            } else {
                reject({status: 500, message: 'Missing test statuses.'})
            }
        });
    }

    static async find(currentUserId, searchData) {
        return new Promise((resolve, reject) => {
            const { itemsPerPage, page, statuses } = searchData;
            if (!currentUserId) {
                return reject({ status: 500, message: 'Should have currentUserId.' });
            }
            if (!itemsPerPage || !page) {
                return reject({ status: 400, message: 'Missing pagination.' });
            }
            const skip = itemsPerPage * (page - 1);
            const limit = itemsPerPage;
            const sort = { 'createdAt': 1 };

            let searchQuery = {};
            if (statuses && statuses.length) {
                searchQuery.status = { $in: statuses };
            }

            TestModel.find(searchQuery).sort(sort).skip(skip).limit(limit)
                .then(res => {
                    TestModel.count(searchQuery).then(count => {
                        resolve({hits: res, totalCount: count});
                    }).catch(err => reject(ErrorResponses.mongoose(err)))
                }).catch(err => reject(ErrorResponses.mongoose(err)))
        });
    }
}

module.exports = TestController;


