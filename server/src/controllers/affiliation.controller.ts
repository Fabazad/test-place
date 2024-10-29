import {
  AffiliatedCommissionStatus,
  PopulatedAffiliationRecord,
} from "@/entities/AffiliationRecord/affiliationRecord.entity.js";
import { getAffiliationRecordDAO } from "@/entities/AffiliationRecord/dao/affiliationRecord.dao.index.js";
import { TestStatus } from "@/entities/Test/test.constants.js";
import { getUserDAO } from "@/entities/User/dao/user.dao.index.js";
import { CustomResponse } from "@/utils/CustomResponse.js";

type AcceptedTestStatus =
  | typeof TestStatus.REQUEST_ACCEPTED
  | typeof TestStatus.MONEY_RECEIVED
  | typeof TestStatus.PRODUCT_ORDERED;

export class AffiliationController {
  static async getUserAffiliated({
    userId,
    page,
    itemsPerPage,
  }: {
    userId: string;
    page: number;
    itemsPerPage: number;
  }): Promise<
    CustomResponse<{
      affiliated: Array<{
        userId: string;
        name: string;
        email: string;
        rateInPercent: number;
        createdAt: string;
      }>;
      totalCount: number;
    }>
  > {
    const userDAO = getUserDAO();
    const { affiliated, totalCount } = await userDAO.getUserAffiliated({
      userId,
      page,
      limit: itemsPerPage,
    });
    return { success: true, data: { affiliated, totalCount } };
  }

  static async checkForAffiliatedCommissionRecord(params: {
    affiliatedId: string;
    productAmount: number;
    testStatus: AcceptedTestStatus;
  }): Promise<
    CustomResponse<
      undefined,
      "could_not_find_user" | "not_affiliated" | "could_not_find_ambassador"
    >
  > {
    const { affiliatedId, productAmount, testStatus } = params;

    const userDAO = getUserDAO();
    const affiliationRecordDAO = getAffiliationRecordDAO();

    const affiliated = await userDAO.getUser({ userId: affiliatedId });
    if (!affiliated) return { success: false, errorCode: "could_not_find_user" };

    if (!affiliated.affiliated) return { success: false, errorCode: "not_affiliated" };

    const ambassador = await userDAO.getUser({ userId: affiliated.affiliated.by });
    if (!ambassador) return { success: false, errorCode: "could_not_find_ambassador" };

    const amount = +parseFloat(
      `${(productAmount * affiliated.affiliated.rateInPercent) / 100}`
    ).toFixed(2);

    const testStatusMap: Record<AcceptedTestStatus, AffiliatedCommissionStatus> = {
      [TestStatus.REQUEST_ACCEPTED]: AffiliatedCommissionStatus.TEST_REQUEST,
      [TestStatus.MONEY_RECEIVED]: AffiliatedCommissionStatus.MONEY_RECEIVED,
      [TestStatus.PRODUCT_ORDERED]: AffiliatedCommissionStatus.PRODUCT_ORDERED,
    };

    await affiliationRecordDAO.createAffiliatedCommissionRecord({
      affiliatedId,
      ambassadorId: ambassador._id,
      rateInPercent: affiliated.affiliated.rateInPercent,
      amount,
      status: testStatusMap[testStatus],
    });

    return { success: true, data: undefined };
  }
  static async getLastAffiliationRecords(params: {
    page: number;
    itemsPerPage: number;
    userId: string;
  }): Promise<
    CustomResponse<{ records: Array<PopulatedAffiliationRecord>; totalCount: number }>
  > {
    const { page, itemsPerPage, userId } = params;
    const affiliationRecordDAO = getAffiliationRecordDAO();

    const { records, totalCount } = await affiliationRecordDAO.getLastRecords({
      page,
      limit: itemsPerPage,
      ambassadorId: userId,
    });

    return { success: true, data: { records, totalCount } };
  }

  static async getUserAffiliationSummary(params: { userId: string }): Promise<
    CustomResponse<{
      affiliatedCount: number;
      totalGeneratedMoney: number;
      outstandingBalance: number;
    }>
  > {
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
