
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e8dafe2e-8ea8-56c7-8424-ed74170a9645")}catch(e){}}();
import { savedDataSchema } from "../../utils/savedDataSchema.js";
import z from "zod";
export const AffiliationRecordParamsType = {
    AFFILIATED_COMMISSION: "affiliatedCommission",
    APP_PAYMENT: "appPayment",
};
const affiliatedCommissionParamsSchema = z.object({
    paramsType: z.literal(AffiliationRecordParamsType.AFFILIATED_COMMISSION),
    affiliated: z.string({ description: "User" }),
    rateInPercent: z.number(),
});
const appPaymentParamsSchema = z.object({
    paramsType: z.literal(AffiliationRecordParamsType.APP_PAYMENT),
});
export const affiliationRecordDataSchema = z.object({
    amount: z.number(),
    ambassadorId: z.string({ description: "User" }),
    params: z.discriminatedUnion("paramsType", [
        affiliatedCommissionParamsSchema,
        appPaymentParamsSchema,
    ]),
});
export const affiliationRecordSchema = affiliationRecordDataSchema.extend(savedDataSchema);
//# sourceMappingURL=affiliationRecord.entity.js.map
//# debugId=e8dafe2e-8ea8-56c7-8424-ed74170a9645
