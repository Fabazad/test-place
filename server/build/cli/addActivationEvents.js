
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="30ba6b01-6ff6-5a68-88e8-d9aca23d15a9")}catch(e){}}();
import { getTestDAO } from "../entities/Test/dao/test.dao.index.js";
import { TestStatus } from "../entities/Test/test.constants.js";
import { getUserDAO } from "../entities/User/dao/user.dao.index.js";
import { ActivationEventType } from "../entities/User/user.entity.js";
import { Role } from "../utils/constants.js";
import { getDatabaseConnection } from "../databaseConnection/index.js";
const filterAndDistinct = (arr1, arr2) => {
    return [...new Set(arr1.filter((a) => !arr2.includes(a)))];
};
const addActivationEvents = async () => {
    const databaseConnection = getDatabaseConnection();
    await databaseConnection.connect();
    const userDAO = getUserDAO();
    const testDAO = getTestDAO();
    const testerIds = await userDAO.getUserIds({ role: Role.TESTER });
    console.log({ testerIds });
    for (const testerId of testerIds) {
        console.log({ testerId });
        const user = await userDAO.getUser({ userId: testerId });
        if (!user)
            continue;
        if (!user.activationEvents)
            user.activationEvents = [];
        const currentActivationEvents = user.activationEvents.map((event) => event.eventType);
        const activationEventsToAdd = [];
        if (user.emailValidation)
            activationEventsToAdd.push(ActivationEventType.EMAIL_VALIDATION);
        const moneyReceivedTestsCount = await testDAO.countTestWithStatues({
            userId: testerId,
            statuses: [TestStatus.MONEY_RECEIVED],
        });
        if (moneyReceivedTestsCount > 0) {
            activationEventsToAdd.push(...[
                ActivationEventType.FIRST_TEST_REQUEST,
                ActivationEventType.FIRST_PRODUCT_ORDERED,
                ActivationEventType.FIRST_PRODUCT_RECEIVED,
                ActivationEventType.FIRST_PRODUCT_REVIEWED,
                ActivationEventType.FIRST_MONEY_RECEIVED,
            ]);
            await userDAO.addActivationEvents({
                userId: testerId,
                eventTypes: filterAndDistinct(activationEventsToAdd, currentActivationEvents),
            });
            continue;
        }
        const productReviewedTestsCount = await testDAO.countTestWithStatues({
            userId: testerId,
            statuses: [
                TestStatus.PRODUCT_REVIEWED,
                TestStatus.REVIEW_VALIDATED,
                TestStatus.REVIEW_REFUSED,
            ],
        });
        if (productReviewedTestsCount > 0) {
            activationEventsToAdd.push(...[
                ActivationEventType.FIRST_TEST_REQUEST,
                ActivationEventType.FIRST_PRODUCT_ORDERED,
                ActivationEventType.FIRST_PRODUCT_RECEIVED,
                ActivationEventType.FIRST_PRODUCT_REVIEWED,
            ]);
            await userDAO.addActivationEvents({
                userId: testerId,
                eventTypes: filterAndDistinct(activationEventsToAdd, currentActivationEvents),
            });
            continue;
        }
        const productReceivedTestsCount = await testDAO.countTestWithStatues({
            userId: testerId,
            statuses: [TestStatus.PRODUCT_RECEIVED],
        });
        if (productReceivedTestsCount > 0) {
            activationEventsToAdd.push(...[
                ActivationEventType.FIRST_TEST_REQUEST,
                ActivationEventType.FIRST_PRODUCT_ORDERED,
                ActivationEventType.FIRST_PRODUCT_RECEIVED,
            ]);
            await userDAO.addActivationEvents({
                userId: testerId,
                eventTypes: filterAndDistinct(activationEventsToAdd, currentActivationEvents),
            });
            continue;
        }
        const productOrderedTestsCount = await testDAO.countTestWithStatues({
            userId: testerId,
            statuses: [TestStatus.PRODUCT_ORDERED],
        });
        if (productOrderedTestsCount > 0) {
            activationEventsToAdd.push(...[
                ActivationEventType.FIRST_TEST_REQUEST,
                ActivationEventType.FIRST_PRODUCT_ORDERED,
            ]);
            await userDAO.addActivationEvents({
                userId: testerId,
                eventTypes: filterAndDistinct(activationEventsToAdd, currentActivationEvents),
            });
            continue;
        }
        const requestAcceptedTestsCount = await testDAO.countTestWithStatues({
            userId: testerId,
            statuses: [
                TestStatus.REQUEST_ACCEPTED,
                TestStatus.REQUEST_DECLINED,
                TestStatus.REQUESTED,
                TestStatus.TEST_CANCELLED,
            ],
        });
        if (requestAcceptedTestsCount > 0) {
            activationEventsToAdd.push(ActivationEventType.FIRST_TEST_REQUEST);
            await userDAO.addActivationEvents({
                userId: testerId,
                eventTypes: filterAndDistinct(activationEventsToAdd, currentActivationEvents),
            });
            continue;
        }
        await userDAO.addActivationEvents({
            userId: testerId,
            eventTypes: filterAndDistinct(activationEventsToAdd, currentActivationEvents),
        });
    }
    await databaseConnection.disconnect();
    process.exit(0);
};
addActivationEvents();
//# sourceMappingURL=addActivationEvents.js.map
//# debugId=30ba6b01-6ff6-5a68-88e8-d9aca23d15a9
