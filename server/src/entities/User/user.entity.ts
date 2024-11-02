import { Role } from "@/utils/constants.js";
import { InferEnum } from "@/utils/inferEnum.js";
import { Language } from "@/utils/Language.js";
import { savedDataSchema } from "@/utils/savedDataSchema.js";
import z from "zod";

export const ActivationEventType = {
  EMAIL_VALIDATION: "emailValidation",
  FIRST_TEST_REQUEST: "firstTestRequest",
  FIRST_PRODUCT_ORDERED: "firstProductOrdered",
  FIRST_PRODUCT_RECEIVED: "firstProductReceived",
  FIRST_PRODUCT_REVIEWED: "firstProductReviewed",
  FIRST_MONEY_RECEIVED: "firstMoneyReceived",
} as const;
export type ActivationEventType = InferEnum<typeof ActivationEventType>;

const activationEventTypeSchema = z.object({
  eventType: z.nativeEnum(ActivationEventType),
  eventDate: z.date(),
});

export const userDataSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().nullish().default(null),
  emailValidation: z.boolean().default(false),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.date().optional(),
  amazonId: z.string().optional(),
  testerMessage: z.string().optional(),
  sellerMessage: z.string().optional(),
  roles: z.array(z.nativeEnum(Role)).min(1),
  paypalEmail: z.string().email().optional(),
  lastLogin: z.date().optional(),
  googleId: z.string().nullish(),
  facebookId: z.string().nullish(),
  language: z.nativeEnum(Language),
  isCertified: z.boolean().default(false),
  affiliatedBy: z.string({ description: "User" }).optional(),
  personalAffiliationRateInPercent: z.number().optional(),
});
export type UserData = z.infer<typeof userDataSchema>;

export const userSchema = userDataSchema
  .extend(savedDataSchema)
  .omit({ affiliatedBy: true })
  .extend({
    affiliated: z
      .object({
        by: z.string({ description: "User" }),
        rateInPercent: z.number(),
      })
      .optional(),
    activationEvents: z.array(activationEventTypeSchema).default([]),
  });
export type User = z.infer<typeof userSchema>;
export type UserWithoutPassword = Omit<User, "password">;
