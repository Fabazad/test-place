
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6092be83-6577-541f-be3a-00a13d1c6aab")}catch(e){}}();
import { getAffiliationRecordDAO } from "../entities/AffiliationRecord/dao/affiliationRecord.dao.index.js";
import { getUserDAO } from "../entities/User/dao/user.dao.index.js";
export class AffiliationController {
    static async getUserAffiliated({ userId, page, itemsPerPage, }) {
        const userDAO = getUserDAO();
        const { affiliated, totalCount } = await userDAO.getUserAffiliated({
            userId,
            page,
            limit: itemsPerPage,
        });
        return { success: true, data: { affiliated, totalCount } };
    }
    static async checkForAffiliatedCommissionRecord(params) {
        const { affiliatedId, productAmount } = params;
        const userDAO = getUserDAO();
        const affiliationRecordDAO = getAffiliationRecordDAO();
        const affiliated = await userDAO.getUser({ userId: affiliatedId });
        if (!affiliated)
            return { success: false, errorCode: "could_not_find_user" };
        if (!affiliated.affiliated)
            return { success: false, errorCode: "not_affiliated" };
        const ambassador = await userDAO.getUser({ userId: affiliated.affiliated.by });
        if (!ambassador)
            return { success: false, errorCode: "could_not_find_ambassador" };
        const amount = +parseFloat(`${(productAmount * affiliated.affiliated.rateInPercent) / 100}`).toFixed(2);
        await affiliationRecordDAO.createAffiliatedCommissionRecord({
            affiliatedId,
            ambassadorId: ambassador._id,
            rateInPercent: affiliated.affiliated.rateInPercent,
            amount,
        });
        return { success: true, data: undefined };
    }
    static async getLastAffiliationRecords(params) {
        const { page, itemsPerPage, userId } = params;
        const affiliationRecordDAO = getAffiliationRecordDAO();
        const { records, totalCount } = await affiliationRecordDAO.getLastRecords({
            page,
            limit: itemsPerPage,
            ambassadorId: userId,
        });
        return { success: true, data: { records, totalCount } };
    }
    static async getUserAffiliationSummary(params) {
        const { userId } = params;
        const userDAO = getUserDAO();
        const affiliationRecordDAO = getAffiliationRecordDAO();
        const [affiliatedCount, totalGeneratedMoney, outstandingBalance] = await Promise.all([
            userDAO.getUserAffiliatedCount({ userId }),
            affiliationRecordDAO.getTotalGeneratedMoney({ userId }),
            affiliationRecordDAO.getOutstandingBalance({ userId }),
        ]);
        return {
            success: true,
            data: { affiliatedCount, totalGeneratedMoney, outstandingBalance },
        };
    }
}
//# sourceMappingURL=affiliation.controller.js.map
//# debugId=6092be83-6577-541f-be3a-00a13d1c6aab
