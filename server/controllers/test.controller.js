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
            const test = new TestModel(testData);

            test.save()
                .then(() => {
                    product.remainingRequests--;
                    product.save()
                        .then(() => resolve(test))
                        .catch(err => reject(ErrorResponses.mongoose(err)))
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
            const {itemsPerPage, page, statuses, asSeller, asTester} = searchData;
            if (!currentUserId) {
                return reject({status: 500, message: 'Should have currentUserId.'});
            }
            if (!itemsPerPage || !page) {
                return reject({status: 400, message: 'Missing pagination.'});
            }
            const skip = itemsPerPage * (page - 1);
            const limit = itemsPerPage;
            const sort = {'createdAt': 1};

            const searchQuery = {};
            const populateList = ['product'];
            if (statuses && statuses.length) {
                searchQuery.status = {$in: statuses};
            }
            if (asSeller) {
                searchQuery.seller = currentUserId;
                populateList.push('tester');
            }
            if (asTester) {
                searchQuery.tester = currentUserId;
                populateList.push('seller');
            }

            TestModel.find(searchQuery).sort(sort).skip(skip).limit(limit).populate(populateList)
                .then(res => {
                    TestModel.count(searchQuery).then(count => {
                        resolve({hits: res, totalCount: count});
                    }).catch(err => reject(ErrorResponses.mongoose(err)))
                }).catch(err => reject(ErrorResponses.mongoose(err)))
        });
    }

    static async cancelRequest(currentUserId, testId, cancelReason) {
        return new Promise(async (resolve, reject) => {
            if (!currentUserId || !testId || !cancelReason) {
                return reject({status: 400, message: "Missing arguments."});
            }

            const test = await TestModel.findById(testId);

            if (!test) {
                return reject({status: 400, message: "Couldn't find the test from the given id."});
            }

            if (test.tester.toString() !== currentUserId) {
                return reject({status: 400, message: "You need to be the tester to cancel the test request."});
            }

            if (test.status !== constants.TEST_STATUSES.requested) {
                return reject({
                    status: 400,
                    message: "The test status has to be 'requested' in order to cancel the request."
                });
            }

            test.status = constants.TEST_STATUSES.requestCancelled;
            test.cancelRequestReason = cancelReason;

            test.save().then(() => {
                ProductModel.findByIdAndUpdate(test.product._id, {$inc: {remainingRequests: 1}})
                    .then(() => resolve(test))
                    .catch(err => reject(ErrorResponses.mongoose(err)))
            })
                .catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }

    static async declineRequest(currentUserId, testId, declineReason) {
        return new Promise(async (resolve, reject) => {
            if (!currentUserId || !testId || !declineReason) {
                return reject({status: 400, message: "Missing arguments."});
            }

            const test = await TestModel.findById(testId);

            if (!test) {
                return reject({status: 400, message: "Couldn't find the test from the given id."});
            }

            if (test.seller.toString() !== currentUserId) {
                return reject({status: 400, message: "You need to be the seller to decline the test request."});
            }

            if (test.status !== constants.TEST_STATUSES.requested) {
                return reject({
                    status: 400,
                    message: "The test status has to be 'requested' in order to decline the request."
                });
            }

            test.status = constants.TEST_STATUSES.requestDeclined;
            test.declineRequestReason = declineReason;

            test.save().then(() => {
                ProductModel.findByIdAndUpdate(test.product._id, {$inc: {remainingRequests: 1}})
                    .then(() => resolve(test))
                    .catch(err => reject(ErrorResponses.mongoose(err)))
            })
                .catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }

    static async acceptRequest(currentUserId, testId, sellerMessage) {
        return new Promise(async (resolve, reject) => {
            if (!currentUserId || !testId) {
                return reject({status: 400, message: "Missing arguments."});
            }

            const test = await TestModel.findById(testId);

            if (!test) {
                return reject({status: 400, message: "Couldn't find the test from the given id."});
            }

            if (test.seller.toString() !== currentUserId) {
                return reject({status: 400, message: "You need to be the seller to decline the test request."});
            }

            if (test.status !== constants.TEST_STATUSES.requested) {
                return reject({
                    status: 400,
                    message: "The test status has to be 'requested' in order to decline the request."
                });
            }

            test.status = constants.TEST_STATUSES.requestAccepted;
            if (sellerMessage) {
                test.sellerMessage = sellerMessage;
            }

            test.save().then(resolve).catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }
}

module.exports = TestController;


