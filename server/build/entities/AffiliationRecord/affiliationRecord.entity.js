
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ffb93377-cda0-5bbb-bcee-8f1c674cd005")}catch(e){}}();
import { savedDataSchema } from "../../utils/savedDataSchema.js";
import z from "zod";
export const AffiliationRecordParamsType = {
    AFFILIATED_COMMISSION: "affiliatedCommission",
    APP_PAYMENT: "appPayment",
};
export const AffiliatedCommissionStatus = {
    TEST_REQUEST: "testRequest",
    PRODUCT_ORDERED: "productOrdered",
    MONEY_RECEIVED: "moneyReceived",
};
const affiliatedCommissionParamsSchema = z.object({
    paramsType: z.literal(AffiliationRecordParamsType.AFFILIATED_COMMISSION),
    affiliated: z.string({ description: "User" }),
    status: z.nativeEnum(AffiliatedCommissionStatus),
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
//# debugId=ffb93377-cda0-5bbb-bcee-8f1c674cd005
