
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="cf61200d-21bb-5787-a088-56e4e02dcd5a")}catch(e){}}();
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
    EMAIL_SENDER_EMAIL: z.string().optional().default("contact@test-place.fr"),
    CONTACT_US_EMAIL_TEMPLATE_ID: numberSchema().optional().default(7),
    EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_FR: numberSchema().optional().default(6),
    EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_EN: numberSchema().optional().default(3),
    EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_CH: numberSchema().optional().default(12),
    EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_BD: numberSchema().optional().default(3),
    FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_FR: numberSchema().optional().default(5),
    FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_EN: numberSchema().optional().default(4),
    FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_CH: numberSchema().optional().default(10),
    FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_BD: numberSchema().optional().default(4),
    NOTIFICATION_EMAIL_TEMPLATE_ID_FR: numberSchema().optional().default(8),
    NOTIFICATION_EMAIL_TEMPLATE_ID_EN: numberSchema().optional().default(11),
    NOTIFICATION_EMAIL_TEMPLATE_ID_CH: numberSchema().optional().default(9),
    NOTIFICATION_EMAIL_TEMPLATE_ID_BD: numberSchema().optional().default(11),
    NEW_TEST_REQUEST_EMAIL_TEMPLATE_ID_FR: numberSchema().optional().default(19),
    NEW_TEST_REQUEST_EMAIL_TEMPLATE_ID_EN: numberSchema().optional().default(20),
    NEW_TEST_REQUEST_EMAIL_TEMPLATE_ID_CH: numberSchema().optional().default(21),
    NEW_TEST_REQUEST_EMAIL_TEMPLATE_ID_BD: numberSchema().optional().default(20),
    TEST_REQUEST_ACCEPTED_EMAIL_TEMPLATE_ID_FR: numberSchema().optional().default(14),
    TEST_REQUEST_ACCEPTED_EMAIL_TEMPLATE_ID_EN: numberSchema().optional().default(13),
    TEST_REQUEST_ACCEPTED_EMAIL_TEMPLATE_ID_CH: numberSchema().optional().default(15),
    TEST_REQUEST_ACCEPTED_EMAIL_TEMPLATE_ID_BD: numberSchema().optional().default(13),
    MONEY_SENT_EMAIL_TEMPLATE_ID_FR: numberSchema().optional().default(16),
    MONEY_SENT_EMAIL_TEMPLATE_ID_EN: numberSchema().optional().default(17),
    MONEY_SENT_EMAIL_TEMPLATE_ID_CH: numberSchema().optional().default(18),
    MONEY_SENT_EMAIL_TEMPLATE_ID_BD: numberSchema().optional().default(17),
    PRODUCT_REVIEWED_EMAIL_TEMPLATE_ID_FR: numberSchema().optional().default(22),
    PRODUCT_REVIEWED_EMAIL_TEMPLATE_ID_EN: numberSchema().optional().default(23),
    PRODUCT_REVIEWED_EMAIL_TEMPLATE_ID_CH: numberSchema().optional().default(24),
    PRODUCT_REVIEWED_EMAIL_TEMPLATE_ID_BD: numberSchema().optional().default(22),
    LAST_PUBLISHED_PRODUCTS_EMAIL_TEMPLATE_ID_FR: numberSchema().optional().default(25),
    LAST_PUBLISHED_PRODUCTS_EMAIL_TEMPLATE_ID_EN: numberSchema().optional().default(26),
    LAST_PUBLISHED_PRODUCTS_EMAIL_TEMPLATE_ID_CH: numberSchema().optional().default(27),
    LAST_PUBLISHED_PRODUCTS_EMAIL_TEMPLATE_ID_BD: numberSchema().optional().default(26),
    SECRET_GOOGLE_CLIENT_ID: z.string(),
    PUBLIC_GOOGLE_CLIENT_ID: z.string(),
    AMAZON_AFFILIATION_TAG: z.string().trim(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_KEY: z.string(),
    S3_BUCKET: z.string(),
    SENTRY_DSN: z.string(),
    PROXY_HOST: z.string().default("brd.superproxy.io"),
    PROXY_USERNAME: z
        .string()
        .default("brd-customer-hl_19852198-zone-residential_proxy1-country-fr-route_err-pass_dyn"),
    PROXY_PORT: z.coerce.number().default(22225),
    PROXY_PASSWORD: z.string(),
    LAST_PUBLISHED_PRODUCTS_PERIOD_IN_DAYS: numberSchema().optional().default(7),
    FRONTEND_URL: z.string().optional().default("https://test-place.fr"),
    WEBFLOW_API_KEY: z.string(),
    AMAZON_ARTICLES_WEBFLOW_COLLECTION_ID: z.string().default("67095b5263ba7126480b36f2"),
    NO_REPLY_EMAIL_SENDER_EMAIL: z.string().optional().default("no-reply@test-place.fr"),
    MAX_TESTING_PER_USER: z.coerce.number().default(2),
    PRODUCTS_LIMIT_ON_LAST_PUBLISHED: z.coerce.number().default(10),
    BRIDGE_SITE_URL: z.string().optional().default("https://chassauxcadeaux.com"),
    BRIDGE_SITE_PARAMS_KEY: z.string().optional().default("redirectUrl"),
    AFFILIATION_RATE_IN_PERCENT: z.coerce.number().default(2),
})
    .parse(process.env);
console.log({ configs });
//# sourceMappingURL=configs.js.map
//# debugId=cf61200d-21bb-5787-a088-56e4e02dcd5a
