
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="f01b075b-0859-5a2d-8310-c64c922e18b0")}catch(e){}}();
import { Role } from "../../utils/constants.js";
import { Language } from "../../utils/Language.js";
import { savedDataSchema } from "../../utils/savedDataSchema.js";
import z from "zod";
export const ActivationEventType = {
    EMAIL_VALIDATION: "emailValidation",
    FIRST_TEST_REQUEST: "firstTestRequest",
    FIRST_PRODUCT_ORDERED: "firstProductOrdered",
    FIRST_PRODUCT_RECEIVED: "firstProductReceived",
    FIRST_PRODUCT_REVIEWED: "firstProductReviewed",
    FIRST_MONEY_RECEIVED: "firstMoneyReceived",
};
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
//# sourceMappingURL=user.entity.js.map
//# debugId=f01b075b-0859-5a2d-8310-c64c922e18b0
