import {
  AffiliatedCommissionStatus,
  PopulatedAffiliationRecord,
} from "@/entities/AffiliationRecord/affiliationRecord.entity.js";
import { getAffiliationRecordDAO } from "@/entities/AffiliationRecord/dao/affiliationRecord.dao.index.js";
import { TestStatus } from "@/entities/Test/test.constants.js";
import { getUserDAO } from "@/entities/User/dao/user.dao.index.js";
import { getMonitoringClient } from "@/libs/MonitoringClient/index.js";
import { CustomResponse } from "@/utils/CustomResponse.js";

export class AffiliationController {
  static async getUserAffiliated({
    userId,
    page,
    itemsPerPage,
    search,
  }: {
    userId: string;
    page: number;
    itemsPerPage: number;
    search?: string;
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
      search,
    });
    return { success: true, data: { affiliated, totalCount } };
  }

  static async checkForAffiliatedCommissionRecord(params: {
    affiliatedId: string;
    productAmount: number;
    testStatus: TestStatus;
  }): Promise<CustomResponse<undefined>> {
    const { affiliatedId, productAmount, testStatus } = params;

    const acceptedTestStatuses = [
      TestStatus.REQUEST_ACCEPTED,
      TestStatus.PRODUCT_ORDERED,
      TestStatus.MONEY_RECEIVED,
    ];
    type AcceptedTestStatus = (typeof acceptedTestStatuses)[number];

    const isAcceptedTestStatus = (status: TestStatus): status is AcceptedTestStatus =>
      (acceptedTestStatuses as Array<TestStatus>).includes(status);

    if (!isAcceptedTestStatus(testStatus)) return { success: true, data: undefined };

    const userDAO = getUserDAO();
    const affiliationRecordDAO = getAffiliationRecordDAO();
    const monitoringClient = getMonitoringClient();

    const affiliated = await userDAO.getUser({ userId: affiliatedId });
    if (!affiliated) {
      await monitoringClient.sendEvent({
        level: "error",
        eventName: "could_not_find_user",
        data: { params },
      });
      return { success: true, data: undefined };
    }

    if (!affiliated.affiliated) return { success: true, data: undefined };

    const ambassador = await userDAO.getUser({ userId: affiliated.affiliated.by });

    if (!ambassador) {
      await monitoringClient.sendEvent({
        level: "error",
        eventName: "could_not_find_ambassador",
        data: { params, ambassador },
      });
      return { success: true, data: undefined };
    }

    const calculatedRateInPercent =
      testStatus === TestStatus.MONEY_RECEIVED ||
      testStatus === TestStatus.PRODUCT_ORDERED
        ? affiliated.affiliated.rateInPercent / 2
        : affiliated.affiliated.rateInPercent;

    const amount = +parseFloat(
      `${(productAmount * calculatedRateInPercent) / 100}`
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
