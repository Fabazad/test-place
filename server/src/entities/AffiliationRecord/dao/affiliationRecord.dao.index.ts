import { generateMongooseSchemaFromZod } from "@/utils/generateMongooseSchemaFromZod/index.js";
import { omittedSavedDataSchema } from "@/utils/savedDataSchema.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import mongoose, { Types } from "mongoose";
import {
  AffiliatedCommissionStatus,
  AffiliationRecord,
  AffiliationRecordParamsType,
  affiliationRecordSchema,
  PopulatedAffiliationRecord,
} from "../affiliationRecord.entity.js";
import { AffiliationRecordDAO } from "./affiliationRecord.dao.type.js";

const mongooseAffiliationRecordSchema = new mongoose.Schema<AffiliationRecord>(
  generateMongooseSchemaFromZod(affiliationRecordSchema.omit(omittedSavedDataSchema)),
  { timestamps: true }
);

mongooseAffiliationRecordSchema
  .index({ ambassadorId: 1, "params.paramsType": 1, "params.status": 1 })
  .index({ ambassadorId: 1, createdAt: -1 });

const affiliationRecordModel = mongoose.model<AffiliationRecord>(
  "AffiliationRecord",
  mongooseAffiliationRecordSchema
);

const createAffiliationRecordDAO = (): AffiliationRecordDAO => {
  return {
    createAffiliatedCommissionRecord: async ({
      affiliatedId,
      ambassadorId,
      amount,
      rateInPercent,
      status,
    }) => {
      await affiliationRecordModel.create({
        params: {
          paramsType: AffiliationRecordParamsType.AFFILIATED_COMMISSION,
          affiliated: affiliatedId,
          rateInPercent,
          status,
        },
        amount,
        ambassadorId,
      });
      return { success: true, data: undefined };
    },
    getLastRecords: async ({ page, limit, ambassadorId }) => {
      const [records, totalCount] = await Promise.all([
        affiliationRecordModel
          .find({ ambassadorId })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("params.affiliated")
          .lean<Array<PopulatedAffiliationRecord>>(),
        affiliationRecordModel.countDocuments({ ambassadorId }),
      ]);

      const populatedRecords = records.map<PopulatedAffiliationRecord>((record) => {
        if (record.params.paramsType === AffiliationRecordParamsType.APP_PAYMENT)
          return record;
        return {
          ...record,
          params: {
            ...record.params,
            affiliated: {
              _id: record.params.affiliated._id,
              name: record.params.affiliated.name,
            },
          },
        };
      });

      return { records: populatedRecords, totalCount };
    },
    getTotalGeneratedMoney: async ({ userId }) => {
      const res = await affiliationRecordModel
        .aggregate<{ totalGeneratedMoney: number }>([
          {
            $match: {
              ambassadorId: new Types.ObjectId(userId),
              "params.paramsType": AffiliationRecordParamsType.AFFILIATED_COMMISSION,
              "params.status": AffiliatedCommissionStatus.MONEY_RECEIVED,
            },
          },
          { $group: { _id: null, totalGeneratedMoney: { $sum: "$amount" } } },
        ])
        .exec();

      return res[0]?.totalGeneratedMoney || 0;
    },
    getOutstandingBalance: async ({ userId }) => {
      const res = await affiliationRecordModel
        .aggregate<{ outstandingBalance: number }>([
          {
            $match: {
              ambassadorId: new Types.ObjectId(userId),
              $or: [
                {
                  "params.paramsType": AffiliationRecordParamsType.AFFILIATED_COMMISSION,
                  "params.status": AffiliatedCommissionStatus.MONEY_RECEIVED,
                },
                {
                  "params.paramsType": AffiliationRecordParamsType.APP_PAYMENT,
                },
              ],
            },
          },
          { $group: { _id: null, outstandingBalance: { $sum: "$amount" } } },
        ])
        .exec();

      return res[0]?.outstandingBalance || 0;
    },
  };
};

export const getAffiliationRecordDAO = createSingletonGetter(createAffiliationRecordDAO);
