
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="facbbc95-9e47-51d2-aab2-e3143ff727a8")}catch(e){}}();
import { generateMongooseSchemaFromZod } from "../../../utils/generateMongooseSchemaFromZod/index.js";
import { omittedSavedDataSchema } from "../../../utils/savedDataSchema.js";
import { createSingletonGetter } from "../../../utils/singleton.js";
import mongoose, { Types } from "mongoose";
import { AffiliationRecordParamsType, affiliationRecordSchema, } from "../affiliationRecord.entity.js";
const mongooseAffiliationRecordSchema = new mongoose.Schema(generateMongooseSchemaFromZod(affiliationRecordSchema.omit(omittedSavedDataSchema)), { timestamps: true });
const affiliationRecordModel = mongoose.model("AffiliationRecord", mongooseAffiliationRecordSchema);
const createAffiliationRecordDAO = () => {
    return {
        createAffiliatedCommissionRecord: async ({ affiliatedId, ambassadorId, amount, rateInPercent, }) => {
            await affiliationRecordModel.create({
                params: {
                    paramsType: AffiliationRecordParamsType.AFFILIATED_COMMISSION,
                    affiliated: affiliatedId,
                    rateInPercent,
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
                    },
                },
                { $group: { _id: null, totalGeneratedMoney: { $sum: "$amount" } } },
            ])
                .exec();
            return res[0]?.totalGeneratedMoney || 0;
        },
        getOutstandingBalance: async ({ userId }) => {
            const res = await affiliationRecordModel
                .aggregate([
                {
                    $match: {
                        ambassadorId: new Types.ObjectId(userId),
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
//# sourceMappingURL=affiliationRecord.dao.index.js.map
//# debugId=facbbc95-9e47-51d2-aab2-e3143ff727a8
