
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="bdd2d64c-c2da-5a8a-8466-b4e218654d86")}catch(e){}}();
import { configs } from "../configs.js";
import { getProductDAO } from "../entities/Product/dao/product.dao.index.js";
import { getTestDAO } from "../entities/Test/dao/test.dao.index.js";
import { GLOBAL_TEST_STATUSES, TestStatus } from "../entities/Test/test.constants.js";
import { getUserDAO } from "../entities/User/dao/user.dao.index.js";
import { NOTIFICATION_TYPES, Role, TEST_STATUS_PROCESSES, } from "../utils/constants.js";
import dayjs from "dayjs";
import { NotificationController } from "./notification.controller.js";
export class TestController {
    static async generateTestData(params) {
        const { product, userId, status, testerMessage } = params;
        const userDAO = getUserDAO();
        const baseTestData = {
            product: product,
            seller: product.seller,
            tester: userId,
            testerMessage,
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
                    sellerMessage: seller.sellerMessage,
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
                    type: NOTIFICATION_TYPES.NEW_REQUEST.value,
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
        if (!testStatusProcessStep.previous.includes(test.status)) {
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
        if (update.status === TestStatus.TEST_CANCELLED ||
            update.status === TestStatus.MONEY_RECEIVED) {
            await Promise.all([
                TestController.checkAndUpdateUserCertification(test.tester),
                TestController.checkAndUpdateUserCertification(test.seller),
            ]);
        }
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
}
//# sourceMappingURL=test.controller.js.map
//# debugId=bdd2d64c-c2da-5a8a-8466-b4e218654d86
