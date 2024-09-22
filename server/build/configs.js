
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="90731000-354e-5d86-ac2f-e555d154133f")}catch(e){}}();
import "dotenv/config";
import z from "zod";
import { numberSchema } from "./utils/zod.utils.js";
export const configs = z
    .object({
    MONGODB_URI: z.string().url(),
    JWT_KEY: z.string(),
    PORT: z.string(),
    SALT_ROUNDS: numberSchema({ min: 0 }).optional().default(10),
    CERTIFIED_RATIO: numberSchema({ min: 0, max: 1 }).optional().default(0.3),
    PUBLICATION_TIME_IN_DAYS: numberSchema({ min: 0, max: 365 }).optional().default(30),
    LONG_SIGN_IN_DURATION: z.string().optional().default("7d"),
    SHORT_SIGN_IN_DURATION: z.string().optional().default("1h"),
    PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES: numberSchema({ min: 0, max: 100 })
        .optional()
        .default(15),
    MIN_PASSWORD_LENGTH: numberSchema({ min: 1 }).optional().default(8),
    BREVO_API_KEY: z.string(),
    BREVO_BASE_URL: z.string().optional().default("https://api.brevo.com/v3"),
    EMAIL_SENDER_NAME: z.string().optional().default("Test Place"),
    EMAIL_SENDER_EMAIL: z.string().optional().default("fabien.turgut@gmail.com"),
    CONTACT_US_EMAIL_TEMPLATE_ID_FR: numberSchema({ min: 1 }).optional().default(0),
    CONTACT_US_EMAIL_TEMPLATE_ID_EN: numberSchema({ min: 1 }).optional().default(0),
    CONTACT_US_EMAIL_TEMPLATE_ID_CH: numberSchema({ min: 1 }).optional().default(0),
    EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_FR: numberSchema({ min: 1 }).optional().default(0),
    EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_EN: numberSchema({ min: 1 }).optional().default(0),
    EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_CH: numberSchema({ min: 1 }).optional().default(0),
    FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_FR: numberSchema({ min: 1 })
        .optional()
        .default(0),
    FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_EN: numberSchema({ min: 1 })
        .optional()
        .default(0),
    FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_CH: numberSchema({ min: 1 })
        .optional()
        .default(0),
    NOTIFICATION_EMAIL_TEMPLATE_ID_FR: numberSchema({ min: 1 }).optional().default(0),
    NOTIFICATION_EMAIL_TEMPLATE_ID_EN: numberSchema({ min: 1 }).optional().default(0),
    NOTIFICATION_EMAIL_TEMPLATE_ID_CH: numberSchema({ min: 1 }).optional().default(0),
    SECRET_GOOGLE_CLIENT_ID: z.string(),
    PUBLIC_GOOGLE_CLIENT_ID: z.string(),
    AMAZON_AFFILIATION_TAG: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_KEY: z.string(),
    S3_BUCKET: z.string(),
    SENTRY_DSN: z.string(),
})
    .parse(process.env);
console.log({ configs });
//# sourceMappingURL=configs.js.map
//# debugId=90731000-354e-5d86-ac2f-e555d154133f
