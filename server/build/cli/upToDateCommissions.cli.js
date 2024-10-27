
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="464f7483-db42-520c-966a-9d69980da812")}catch(e){}}();
import { getAffiliationRecordDAO } from "../entities/AffiliationRecord/dao/affiliationRecord.dao.index.js";
import { getTestDAO } from "../entities/Test/dao/test.dao.index.js";
import { TestStatus } from "../entities/Test/test.constants.js";
import { getUserDAO } from "../entities/User/dao/user.dao.index.js";
import { getDatabaseConnection } from "../databaseConnection/index.js";
const upToDateCommissions = async () => {
    const affiliationRecordDAO = getAffiliationRecordDAO();
    const userDAO = getUserDAO();
    const testDAO = getTestDAO();
    const databaseConnection = getDatabaseConnection();
    await databaseConnection.connect();
    const { affiliated } = await userDAO.getUserAffiliated({
        userId: "66f9a5512ccc4990d7d8a570",
        limit: 50,
        page: 1,
    });
    let totalCommissions = 0;
    for (const affiliate of affiliated) {
        const { userId, rateInPercent } = affiliate;
        const userTests = await testDAO.findManyByUser({
            userId,
            status: [
                TestStatus.MONEY_SENT,
                TestStatus.MONEY_RECEIVED,
                TestStatus.REVIEW_VALIDATED,
                TestStatus.PRODUCT_REVIEWED,
                TestStatus.PRODUCT_RECEIVED,
                TestStatus.PRODUCT_ORDERED,
            ],
        });
        const userCommissions = userTests.reduce((acc, curr) => {
            const { product } = curr;
            const { price } = product;
            return acc + (price * rateInPercent) / 100;
        }, 0);
        console.log({ userId, userCommissions });
        totalCommissions += userCommissions;
    }
    console.log({ totalCommissions });
    await databaseConnection.disconnect();
    process.exit(0);
};
upToDateCommissions();
//# sourceMappingURL=upToDateCommissions.cli.js.map
//# debugId=464f7483-db42-520c-966a-9d69980da812
