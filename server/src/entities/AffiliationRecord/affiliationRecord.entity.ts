import { InferEnum } from "@/utils/inferEnum.js";
import { savedDataSchema } from "@/utils/savedDataSchema.js";
import { User } from "@sentry/node";
import z from "zod";

export const AffiliationRecordParamsType = {
  AFFILIATED_COMMISSION: "affiliatedCommission",
  APP_PAYMENT: "appPayment",
} as const;
export type AffiliationRecordParamsType = InferEnum<typeof AffiliationRecordParamsType>;

export const AffiliatedCommissionStatus = {
  TEST_REQUEST: "testRequest",
  PRODUCT_ORDERED: "productOrdered",
  MONEY_RECEIVED: "moneyReceived",
} as const;
export type AffiliatedCommissionStatus = InferEnum<typeof AffiliatedCommissionStatus>;

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

export type AffiliationRecordData = z.infer<typeof affiliationRecordDataSchema>;

export const affiliationRecordSchema =
  affiliationRecordDataSchema.extend(savedDataSchema);

type AffiliatedCommissionParams<Affiliated = string> = Omit<
  z.infer<typeof affiliatedCommissionParamsSchema>,
  "affiliated"
> & { affiliated: Affiliated };

type AppPaymentParams = z.infer<typeof appPaymentParamsSchema>;

export type AffiliationRecord<Affiliated = string> = Omit<
  z.infer<typeof affiliationRecordSchema>,
  "params"
> & { params: AffiliatedCommissionParams<Affiliated> | AppPaymentParams };

export type PopulatedAffiliationRecord = AffiliationRecord<{
  _id: User["_id"];
  name: User["name"];
}>;
