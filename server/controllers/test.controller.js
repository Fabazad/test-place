const constants = require("../helpers/constants");
const TestModel = require('../models/test.model');
const ProductModel = require('../models/product.model');
const NotificationModel = require('../models/notification.model');
const ErrorResponses = require("../helpers/ErrorResponses");
const moment = require("moment");
const UserModel = require("../models/user.model");
const ObjectId = require('mongoose').Types.ObjectId;

const {TEST_STATUS_PROCESSES, ROLES, TEST_STATUSES, NOTIFICATION_TYPES, GLOBAL_TEST_STATUSES} = constants;

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
            if ("testsCount" in product && product.testsCount >= product.maxDemands) {
                return reject({status: 400, message: "Not enough remaining requests on this product."});
            }
            if (product.seller.toString() === userId) {
                return reject({status: 400, message: "You can't test your own product."});
            }
            testData.tester = userId;
            testData.seller = product.seller._id.toString();
            testData.product = product;

            // Automatic Acceptance
            if ('status' in testData && testData.status === constants.TEST_STATUSES.requestAccepted) {
                if (!product.automaticAcceptance) {
                    return reject({status: 400, message: "This product doesn't have automatic acceptance."})
                }
                testData.sellerMessage = product.seller.sellerMessage;
                testData.expirationDate = null;
            } else {
                testData.status = constants.TEST_STATUSES.requested;
                testData.expirationDate = moment().add(7, 'days').toDate();
            }

            testData.createdAt = new Date();
            const test = new TestModel(testData);

            test.save()
                .then(async () => {
                    try {
                        await Promise.all([
                            product.save(),
                            NotificationModel.create({
                                user: test.seller,
                                type: NOTIFICATION_TYPES.NEW_REQUEST.value,
                                test: Object.assign({}, test)
                            })
                        ]);
                        return resolve(test)
                    } catch (err) {
                        reject(ErrorResponses.mongoose(err))
                    }
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
            const sort = {'createdAt': -1};

            const searchQuery = {
                $or: [
                    {expirationDate: {$gt: new Date()}},
                    {expirationDate: {$eq: null}}
                ]

            };

            const populateList = ['tester', 'seller'];

            if (statuses && statuses.length) searchQuery.status = {$in: statuses};

            if (asSeller) searchQuery.seller = currentUserId;

            if (asTester) searchQuery.tester = currentUserId;

            const [hits, totalCount] = await Promise.all([
                TestModel.find(searchQuery).sort(sort).skip(skip).limit(limit).populate(populateList),
                TestModel.count(searchQuery)
            ]).catch(err => reject(ErrorResponses.mongoose(err)));

            return resolve({hits, totalCount});
        });
    }

    static async countTestWithStatues(userId, statuses, withGuilty = false) {
        const query = {
            $and: [
                {$or: [{seller: userId}, {tester: userId}]},
                {
                    $or: [{
                        expirationDate: {$gt: new Date()}
                    }, {
                        expirationDate: {$eq: null}
                    }]
                }
            ],
            status: statuses
        };

        if (statuses.includes(TEST_STATUSES.testCancelled) && withGuilty) {
            query.cancellationGuilty = userId;
        }

        return TestModel.count(query);
    }

    static async checkAndUpdateUserCertification(userId) {
        try {
            const [completedTestsCount, cancelledTestsCount, user] = await Promise.all([
                TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.COMPLETED),
                TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.CANCELLED, true),
                UserModel.findOne({_id: userId})
            ]);

            const isCertified = completedTestsCount * constants.CERTIFIED_RATIO >= cancelledTestsCount;
            if (user.isCertified === isCertified) return user;
            const newUser = await UserModel.updateOne({_id: user._id}, {$set: {isCertified}});
            return newUser;
        } catch (err) {
            return Promise.reject(ErrorResponses.mongoose(err));
        }
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
                && moment(statusProcess.param.estimatedDeliveryDate).isBefore()) {
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

            if (test.status !== statusProcess.previous && !statusProcess.previous.includes(test.status)) {
                return reject({
                    status: 400,
                    message: `The test status has to be ${statusProcess.previous} in order to update to ${status}.`
                });
            }

            test.status = status;

            if (statusProcess.params && statusProcess.params.length /*params[statusProcess.param]*/) {
                statusProcess.params.forEach(paramKey => {
                    if (params[paramKey]) {
                        test[paramKey] = params[paramKey];
                    }
                });
            }

            if (status !== TEST_STATUSES.requested) test.expirationDate = null;
            if (status === TEST_STATUSES.testCancelled) test.cancellationGuilty = currentUserId;

            try {
                const newTest = await test.save();
                const [requestedTestsCount, processingTestsCount, completedTestsCount, cancelledTestsCount, _] = await Promise.all([
                    this.countTestWithStatues(currentUserId, GLOBAL_TEST_STATUSES.REQUESTED),
                    this.countTestWithStatues(currentUserId, GLOBAL_TEST_STATUSES.PROCESSING),
                    this.countTestWithStatues(currentUserId, GLOBAL_TEST_STATUSES.COMPLETED),
                    this.countTestWithStatues(currentUserId, GLOBAL_TEST_STATUSES.CANCELLED),
                    NotificationModel.create({
                        user: statusProcess.role ?
                            (statusProcess.role === ROLES.TESTER ? test.seller : test.tester) :
                            (currentUserId === test.seller.toString() ? test.tester : test.seller),
                        type: statusProcess.notificationType,
                        test: Object.assign({}, test)
                    })
                ]);

                if (status === TEST_STATUSES.testCancelled || status === TEST_STATUSES.moneyReceived) {
                    await Promise.all([TestController.checkAndUpdateUserCertification(test.tester), TestController.checkAndUpdateUserCertification(test.seller)]);
                }

                resolve({
                    test: newTest,
                    requestedTestsCount,
                    processingTestsCount,
                    completedTestsCount,
                    cancelledTestsCount
                });
            } catch (err) {
                reject(ErrorResponses.mongoose(err))
            }
        });
    }

    static async getTest(testId, userId, roles) {
        if (!ObjectId.isValid(testId)) {
            return Promise.reject({status: 400, message: "Wrong test id."});
        }

        const test = await TestModel.findById(testId).populate(['seller', 'tester']);

        if (!test) {
            return Promise.reject({status: 404, message: "Couldn't find test."});
        }

        if (test.seller._id.toString() !== userId && test.tester._id.toString() !== userId && !roles.includes(ROLES.ADMIN)) {
            return Promise.reject({status: 403, message: "You are neither the tester or the seller of this test."});
        }

        return Promise.resolve(test);
    }

}

module.exports = TestController;


