
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a4502f11-1c08-5c8d-857f-a77bd0e81c27")}catch(e){}}();
import { configs } from "../configs.js";
import { getProductDAO } from "../entities/Product/dao/product.dao.index.js";
import { getTestDAO } from "../entities/Test/dao/test.dao.index.js";
import { GLOBAL_TEST_STATUSES, TestStatus } from "../entities/Test/test.constants.js";
import { MessageSenderType, } from "../entities/Test/test.entity.js";
import { getUserDAO } from "../entities/User/dao/user.dao.index.js";
import { NotificationType, Role, TEST_STATUS_PROCESSES, } from "../utils/constants.js";
import dayjs from "dayjs";
import { AffiliationController } from "./affiliation.controller.js";
import { NotificationController } from "./notification.controller.js";
import { UserController } from "./user.controller.js";
export class TestController {
    static async generateTestData(params) {
        const { product, userId, status, testerMessage } = params;
        const userDAO = getUserDAO();
        const baseTestData = {
            product: product,
            seller: product.seller,
            tester: userId,
            messages: testerMessage
                ? [
                    {
                        sender: { senderType: MessageSenderType.TESTER, userId },
                        message: testerMessage,
                        date: new Date(),
                    },
                ]
                : [],
        };
        if (status === TestStatus.REQUEST_ACCEPTED) {
            if (!product.automaticAcceptance) {
                return { success: false, errorCode: "dont_have_automatic_acceptance" };
            }
            const seller = await userDAO.getUser({ userId: product.seller });
            if (!seller) {
                return { success: false, errorCode: "seller_not_found" };
            }
            return {
                success: true,
                data: {
                    ...baseTestData,
                    status: TestStatus.REQUEST_ACCEPTED,
                    messages: seller.sellerMessage
                        ? [
                            ...(baseTestData.messages ?? []),
                            {
                                sender: { senderType: MessageSenderType.SELLER, userId: seller._id },
                                message: seller.sellerMessage,
                                date: new Date(),
                            },
                        ]
                        : baseTestData.messages,
                    expirationDate: null,
                    updates: [],
                },
            };
        }
        return {
            success: true,
            data: {
                ...baseTestData,
                status: TestStatus.REQUESTED,
                expirationDate: dayjs().add(7, "days").toDate(),
                updates: [],
            },
        };
    }
    static async create(params) {
        const { productId, userId, status, testerMessage, frontendUrl } = params;
        const productDAO = getProductDAO();
        const testDAO = getTestDAO();
        const currentTestCount = await testDAO.countTestWithStatues({
            userId,
            statuses: [...GLOBAL_TEST_STATUSES.PROCESSING, TestStatus.REQUESTED],
        });
        if (currentTestCount >= configs.MAX_TESTING_PER_USER) {
            return { success: false, errorCode: "testing_limit_reached" };
        }
        const product = await productDAO.getProductById({ id: productId });
        if (!product) {
            return { success: false, errorCode: "product_not_found" };
        }
        if (product.remainingTestsCount <= 0) {
            return { success: false, errorCode: "not_enough_remaining_requests" };
        }
        if (product.seller === userId) {
            return { success: false, errorCode: "user_is_seller" };
        }
        const testDataRes = await this.generateTestData({
            product,
            userId,
            status,
            testerMessage,
        });
        if (!testDataRes.success)
            return testDataRes;
        const creationRes = await testDAO.createTest({ testData: testDataRes.data });
        if (!creationRes.success)
            return creationRes;
        const test = creationRes.data;
        await Promise.all([
            productDAO.decrementRemainingTestsCount({ productId }),
            NotificationController.createNotification({
                notificationData: {
                    user: test.seller,
                    type: NotificationType.NEW_REQUEST,
                    test: test,
                    product,
                },
                frontendUrl,
            }),
        ]);
        return { success: true, data: test };
    }
    static async getStatuses() {
        return TestStatus;
    }
    static async find(params) {
        const { userId, searchData } = params;
        const { itemsPerPage, page, statuses, asSeller, asTester } = searchData;
        const testDAO = getTestDAO();
        const skip = itemsPerPage * (page - 1);
        const limit = itemsPerPage;
        const [hits, totalCount] = await Promise.all([
            testDAO.findWIthAllPopulated({
                statuses,
                seller: asSeller ? userId : undefined,
                tester: asTester ? userId : undefined,
                skip,
                limit,
            }),
            testDAO.count({
                statuses,
                seller: asSeller ? userId : undefined,
                tester: asTester ? userId : undefined,
            }),
        ]);
        return { success: true, data: { hits, totalCount } };
    }
    static async checkAndUpdateUserCertification(userId) {
        const testDAO = getTestDAO();
        const userDAO = getUserDAO();
        const [completedTestsCount, cancelledTestsCount, user] = await Promise.all([
            testDAO.countTestWithStatues({ userId, statuses: GLOBAL_TEST_STATUSES.COMPLETED }),
            testDAO.countTestWithStatues({
                userId,
                statuses: GLOBAL_TEST_STATUSES.CANCELLED,
                withGuilty: true,
            }),
            userDAO.getUser({ userId }),
        ]);
        if (!user)
            return { success: false, errorCode: "user_not_found" };
        const isCertified = completedTestsCount * configs.CERTIFIED_RATIO >= cancelledTestsCount;
        if (user.isCertified === isCertified)
            return { success: true, data: user };
        const newUser = await userDAO.setIsCertified({ userId, isCertified });
        if (!newUser)
            return { success: false, errorCode: "user_not_found_while_updating" };
        return { success: true, data: newUser };
    }
    static async updateStatus({ userId, testId, update, frontendUrl, }) {
        const testDAO = getTestDAO();
        const testStatusProcessStep = TEST_STATUS_PROCESSES[update.status];
        const test = await testDAO.findById({ id: testId });
        if (!test)
            return { success: false, errorCode: "test_not_found" };
        if (testStatusProcessStep.role) {
            if (testStatusProcessStep.role === Role.TESTER && test.tester !== userId) {
                return { success: false, errorCode: "only_allowed_for_tester" };
            }
            if (testStatusProcessStep.role === Role.SELLER && test.seller !== userId) {
                return { success: false, errorCode: "only_allowed_for_seller" };
            }
        }
        if (!testStatusProcessStep.previous?.includes(test.status)) {
            return { success: false, errorCode: "wrong_previous_status" };
        }
        const newTest = await testDAO.updateTestStatus({
            id: testId,
            statusUpdate: update,
            cancellationGuilty: update.status === TestStatus.TEST_CANCELLED ? userId : undefined,
        });
        if (newTest === null) {
            return { success: false, errorCode: "test_not_found_when_updating" };
        }
        const userToNotify = testStatusProcessStep.role
            ? testStatusProcessStep.role === Role.TESTER
                ? test.seller
                : test.tester
            : userId === test.seller
                ? test.tester
                : test.seller;
        const [requestedTestsCount, processingTestsCount, completedTestsCount, cancelledTestsCount,] = await Promise.all([
            testDAO.countTestWithStatues({ userId, statuses: GLOBAL_TEST_STATUSES.REQUESTED }),
            testDAO.countTestWithStatues({ userId, statuses: GLOBAL_TEST_STATUSES.PROCESSING }),
            testDAO.countTestWithStatues({ userId, statuses: GLOBAL_TEST_STATUSES.COMPLETED }),
            testDAO.countTestWithStatues({ userId, statuses: GLOBAL_TEST_STATUSES.CANCELLED }),
            NotificationController.createNotification({
                notificationData: {
                    user: userToNotify,
                    test: newTest,
                    type: testStatusProcessStep.notificationType,
                    product: newTest.product,
                },
                frontendUrl,
            }),
        ]);
        await Promise.all([
            AffiliationController.checkForAffiliatedCommissionRecord({
                affiliatedId: test.tester,
                productAmount: test.product.price,
                testStatus: update.status,
            }),
            UserController.checkForActivationEventsOnTestStatusUpdate(test.tester, update.status),
        ]);
        return {
            success: true,
            data: {
                test: newTest,
                requestedTestsCount,
                processingTestsCount,
                completedTestsCount,
                cancelledTestsCount,
            },
        };
    }
    static async getTest(params) {
        const { testId, userId, roles } = params;
        const testDAO = getTestDAO();
        const test = await testDAO.findPopulatedById({ id: testId });
        if (!test) {
            return { success: false, errorCode: "not_found" };
        }
        if (test.seller._id !== userId &&
            test.tester._id !== userId &&
            !roles.includes(Role.ADMIN)) {
            return { success: false, errorCode: "not_allowed" };
        }
        return { success: true, data: test };
    }
    static async checkPendingTests(params) {
        const { cancelPendingDays, notificationPendingDays, frontendUrl, dryRun } = params;
        const testDAO = getTestDAO();
        const [testsToNotify, testsToCancel] = await Promise.all([
            testDAO.findPendingTests({
                pendingDays: notificationPendingDays,
            }),
            testDAO.findPendingTests({
                minPendingDays: cancelPendingDays,
            }),
        ]);
        console.log("Start", {
            testsToCancel: testsToCancel.length,
            testsToNotify: testsToNotify.length,
        });
        const getGuilty = (test) => {
            const guiltyMap = {
                [TestStatus.REQUEST_ACCEPTED]: test.tester,
                [TestStatus.PRODUCT_ORDERED]: test.tester,
                [TestStatus.PRODUCT_RECEIVED]: test.tester,
                [TestStatus.PRODUCT_REVIEWED]: test.seller,
                [TestStatus.MONEY_RECEIVED]: null,
                [TestStatus.MONEY_SENT]: test.tester,
                [TestStatus.REVIEW_VALIDATED]: test.seller,
                [TestStatus.TEST_CANCELLED]: null,
                [TestStatus.REQUEST_CANCELLED]: null,
                [TestStatus.REQUEST_DECLINED]: null,
                [TestStatus.REQUESTED]: test.seller,
                [TestStatus.REVIEW_REFUSED]: null,
            };
            return guiltyMap[test.status];
        };
        const testsCancellations = testsToCancel.map((test) => ({
            testId: test._id,
            guiltyUserId: getGuilty(test),
        }));
        if (!dryRun) {
            await testDAO.cancelTests({
                testsCancellations,
                adminMessage: "Timeout, the test has been cancelled because it's been too long in the same status.",
            });
        }
        console.log({
            testsToCancel: testsToCancel.length,
        });
        if (!dryRun) {
            await Promise.all(testsToNotify.map((test) => NotificationController.createNotification({
                frontendUrl,
                notificationData: {
                    user: getGuilty(test),
                    type: TEST_STATUS_PROCESSES[test.status].notificationType,
                    test,
                    product: test.product,
                },
            })));
        }
        console.log({
            testsToNotify: testsToNotify.length,
        });
        return { success: true, data: undefined };
    }
    static async addMessage(params) {
        const { testId, message, senderUserId, frontendUrl } = params;
        const testDAO = getTestDAO();
        const test = await testDAO.findById({ id: testId });
        if (!test)
            return { success: false, errorCode: "test_not_found" };
        const senderType = test?.seller === senderUserId ? MessageSenderType.SELLER : MessageSenderType.TESTER;
        const receiverUserId = senderType === MessageSenderType.SELLER ? test.tester : test.seller;
        await testDAO.addMessage({
            testId,
            message,
            sender: { senderType, userId: senderUserId },
        });
        await NotificationController.createNotification({
            notificationData: {
                test,
                type: NotificationType.NEW_MESSAGE,
                product: test.product,
                user: receiverUserId,
            },
            frontendUrl,
        });
        return { success: true, data: undefined };
    }
}
//# sourceMappingURL=test.controller.js.map
//# debugId=a4502f11-1c08-5c8d-857f-a77bd0e81c27
