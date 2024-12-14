
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="8169138c-d817-5c5c-9709-76f270645678")}catch(e){}}();
import { AffiliatedCommissionStatus } from "../entities/AffiliationRecord/affiliationRecord.entity.js";
import { getAffiliationRecordDAO } from "../entities/AffiliationRecord/dao/affiliationRecord.dao.index.js";
import { getDatabaseConnection } from "../databaseConnection/index.js";
const migrateToDoubleAffiliation = async () => {
    const databaseConnection = getDatabaseConnection();
    try {
        await databaseConnection.connect();
        const affiliationRecordDAO = getAffiliationRecordDAO();
        const recordsToUpdate = await affiliationRecordDAO.getRecordsByStatus({
            status: [
                AffiliatedCommissionStatus.MONEY_RECEIVED,
                AffiliatedCommissionStatus.PRODUCT_ORDERED,
            ],
        });
        const newRecords = recordsToUpdate.map((record) => ({
            ...record,
            amount: +parseFloat(`${record.amount / 2}`).toFixed(2),
            params: {
                ...record.params,
                rateInPercent: 1,
            },
        }));
        console.log(recordsToUpdate.map((record) => record.amount), newRecords.map((record) => record.amount));
        await affiliationRecordDAO.updateRecords(newRecords);
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await databaseConnection.disconnect();
    }
};
migrateToDoubleAffiliation();
//# sourceMappingURL=migrateToDoubleAffiliation.cli.js.map
//# debugId=8169138c-d817-5c5c-9709-76f270645678
