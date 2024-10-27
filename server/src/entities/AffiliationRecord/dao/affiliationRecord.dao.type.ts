import { CustomResponse } from "@/utils/CustomResponse.js";
import { PopulatedAffiliationRecord } from "../affiliationRecord.entity.js";

export type AffiliationRecordDAO = {
  createAffiliatedCommissionRecord: (params: {
    affiliatedId: string;
    ambassadorId: string;
    amount: number;
    rateInPercent: number;
  }) => Promise<CustomResponse<undefined>>;
  getLastRecords: (params: {
    page: number;
    limit: number;
    ambassadorId: string;
  }) => Promise<{
    records: Array<PopulatedAffiliationRecord>;
    totalCount: number;
  }>;
  getTotalGeneratedMoney: (params: { userId: string }) => Promise<number>;
  getOutstandingBalance: (params: { userId: string }) => Promise<number>;
};
