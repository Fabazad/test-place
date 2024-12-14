import { CustomResponse } from "@/utils/CustomResponse.js";
import {
  AffiliatedCommissionStatus,
  AffiliationRecord,
  PopulatedAffiliationRecord,
} from "../affiliationRecord.entity.js";

export type AffiliationRecordDAO = {
  createAffiliatedCommissionRecord: (params: {
    affiliatedId: string;
    ambassadorId: string;
    amount: number;
    rateInPercent: number;
    status: AffiliatedCommissionStatus;
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
  getRecordsByStatus: (params: {
    status: Array<AffiliatedCommissionStatus>;
  }) => Promise<Array<AffiliationRecord>>;
  updateRecords: (params: Array<AffiliationRecord>) => Promise<undefined>;
};
