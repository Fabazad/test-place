const constants = require("../helpers/constants");
const TestModel = require('../models/test.model');
const ProductModel = require('../models/product.model');
const ErrorResponses = require("../helpers/ErrorResponses");
const moment = require("moment");

const {TEST_STATUS_PROCESSES, ROLES} = constants;

class TestController {

    static async create(testData, userId, amazonId) {
        return new Promise(async (resolve, reject) => {
            if (!amazonId) {
                return reject({status: 403, message: "Unauthorized."});
            }
            const product = await ProductModel.findById(testData.product).populate("seller");
            if (!product) {
                return reject({status: 400, message: "Couldn't find product."});
            }
            if (product.remainingRequests < 1) {
                return reject({status: 400, message: "Not enough remaining requests on this product."});
            }
            if (product.seller.toString() === userId) {
                return reject({status: 400, message: "You can't test your own product."});
            }
            testData.tester = userId;
            testData.seller = product.seller._id.toString();

            // Automatic Acceptance
            if ('status' in testData && testData.status === constants.TEST_STATUSES.requestAccepted) {
                if (!product.automaticAcceptance) {
                    return reject({status: 400, message: "This product doesn't have automatic acceptance."})
                }
                testData.sellerMessage = product.seller.sellerMessage;
            } else {
                testData.status = constants.TEST_STATUSES.requested;
            }

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
        return new Promise(async (resolve, reject) => {
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

            const [hits, totalCount] = await Promise.all([
                TestModel.find(searchQuery).sort(sort).skip(skip).limit(limit).populate(populateList),
                TestModel.count(searchQuery)
            ]).catch(err => reject(ErrorResponses.mongoose(err)));

            return resolve({ hits, totalCount });
        });
    }

    static async updateStatus(currentUserId, testId, status, params = {}) {
        return new Promise(async (resolve, reject) => {

            const statusProcess = TEST_STATUS_PROCESSES[status];

            if (!statusProcess) {
                return reject({status: 400, message: "Wrong status."});
            }

            if (!currentUserId || !testId || (statusProcess.param && !params[statusProcess.param])) {
                return reject({status: 400, message: "Missing arguments."});
            }

            if (statusProcess.param && statusProcess.param.estimatedDeliveryDate
                && (statusProcess.param.estimatedDeliveryDate).isBefore()) {
                return reject({status: 400, message: "The estimated delivery time can't be in the past."});
            }

            const test = await TestModel.findById(testId);

            if (!test) {
                return reject({status: 400, message: "Couldn't find the test from the given id."});
            }

            if (statusProcess.role === ROLES.TESTER && test.tester.toString() !== currentUserId) {
                return reject({status: 400, message: "You need to be the tester."});
            }
            if (statusProcess.role === ROLES.SELLER && test.seller.toString() !== currentUserId) {
                return reject({status: 400, message: "You need to be the seller."});
            }

            if (test.status !== statusProcess.previous) {
                return reject({
                    status: 400,
                    message: `The test status has to be ${statusProcess.previous} in order to update to ${status}.`
                });
            }

            test.status = status;

            if (statusProcess.param && params[statusProcess.param]) {
                test[statusProcess.param] = params[statusProcess.param];
            }

            test.save().then(resolve).catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }
}

module.exports = TestController;


