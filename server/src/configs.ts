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
    CONTACT_US_EMAIL_TEMPLATE_ID_FR: z.string().optional().default("unknown"),
    CONTACT_US_EMAIL_TEMPLATE_ID_EN: z.string().optional().default("unknown"),
    CONTACT_US_EMAIL_TEMPLATE_ID_CH: z.string().optional().default("unknown"),
    EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_FR: z.string().optional().default("unknown"),
    EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_EN: z.string().optional().default("unknown"),
    EMAIL_VALIDATION_EMAIL_TEMPLATE_ID_CH: z.string().optional().default("unknown"),
    FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_FR: z.string().optional().default("unknown"),
    FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_EN: z.string().optional().default("unknown"),
    FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID_CH: z.string().optional().default("unknown"),
    NOTIFICATION_EMAIL_TEMPLATE_ID_FR: z.string().optional().default("unknown"),
    NOTIFICATION_EMAIL_TEMPLATE_ID_EN: z.string().optional().default("unknown"),
    NOTIFICATION_EMAIL_TEMPLATE_ID_CH: z.string().optional().default("unknown"),
  })
  .parse(process.env);

console.log({ configs });
