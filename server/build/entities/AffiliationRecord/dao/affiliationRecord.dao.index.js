
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6bf7e49c-c39f-5368-8cfe-e065552ecf06")}catch(e){}}();
import { generateMongooseSchemaFromZod } from "../../../utils/generateMongooseSchemaFromZod/index.js";
import { omittedSavedDataSchema } from "../../../utils/savedDataSchema.js";
import { createSingletonGetter } from "../../../utils/singleton.js";
import mongoose, { Types } from "mongoose";
import { round } from "../../../utils/round.js";
import { AffiliatedCommissionStatus, AffiliationRecordParamsType, affiliationRecordSchema, } from "../affiliationRecord.entity.js";
const mongooseAffiliationRecordSchema = new mongoose.Schema(generateMongooseSchemaFromZod(affiliationRecordSchema.omit(omittedSavedDataSchema)), { timestamps: true });
mongooseAffiliationRecordSchema
    .index({ ambassadorId: 1, "params.paramsType": 1, "params.status": 1 })
    .index({ ambassadorId: 1, createdAt: -1 });
const affiliationRecordModel = mongoose.model("AffiliationRecord", mongooseAffiliationRecordSchema);
const createAffiliationRecordDAO = () => {
    return {
        createAffiliatedCommissionRecord: async ({ affiliatedId, ambassadorId, amount, rateInPercent, status, }) => {
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
                    .lean(),
                affiliationRecordModel.countDocuments({ ambassadorId }),
            ]);
            const populatedRecords = records.map((record) => {
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
                .aggregate([
                {
                    $match: {
                        ambassadorId: new Types.ObjectId(userId),
                        "params.paramsType": AffiliationRecordParamsType.AFFILIATED_COMMISSION,
                        "params.status": {
                            $in: [
                                AffiliatedCommissionStatus.MONEY_RECEIVED,
                                AffiliatedCommissionStatus.PRODUCT_ORDERED,
                            ],
                        },
                    },
                },
                { $group: { _id: null, totalGeneratedMoney: { $sum: "$amount" } } },
            ])
                .exec();
            return round(res[0]?.totalGeneratedMoney || 0, 2);
        },
        getOutstandingBalance: async ({ userId }) => {
            const res = await affiliationRecordModel
                .aggregate([
                {
                    $match: {
                        ambassadorId: new Types.ObjectId(userId),
                        $or: [
                            {
                                "params.paramsType": AffiliationRecordParamsType.AFFILIATED_COMMISSION,
                                "params.status": {
                                    $in: [
                                        AffiliatedCommissionStatus.MONEY_RECEIVED,
                                        AffiliatedCommissionStatus.PRODUCT_ORDERED,
                                    ],
                                },
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
            return round(res[0]?.outstandingBalance || 0, 2);
        },
        getRecordsByStatus: async ({ status }) => {
            const res = await affiliationRecordModel
                .find({
                "params.paramsType": AffiliationRecordParamsType.AFFILIATED_COMMISSION,
                "params.status": { $in: status },
            })
                .lean();
            return res;
        },
        updateRecords: async (records) => {
            const bulkWrites = records.map((record) => ({
                updateOne: {
                    filter: { _id: record._id },
                    update: { $set: record },
                },
            }));
            await affiliationRecordModel.bulkWrite(bulkWrites);
        },
    };
};
export const getAffiliationRecordDAO = createSingletonGetter(createAffiliationRecordDAO);
//# sourceMappingURL=affiliationRecord.dao.index.js.map
//# debugId=6bf7e49c-c39f-5368-8cfe-e065552ecf06
