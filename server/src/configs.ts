import "dotenv/config";
import z, { ZodTypeAny } from "zod";

const configsToCheck = {
  MONGODB_URI: process.env.MONGODB_URI,
  MONGO_LOCAL_URL: process.env.MONGO_LOCAL_URL,
  JWT_KEY: process.env.JWT_KEY,
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  FRONTEND_LOCAL_URL: process.env.FRONTEND_LOCAL_URL,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
  PAYPAL_WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID,
  PAYPAL_WEBHOOK_SECRET: process.env.PAYPAL_WEBHOOK_SECRET,
  AMAZON_ID: process.env.AMAZON_ID,
  AMAZON_SECRET: process.env.AMAZON_SECRET,
  AMAZON_BUCKET: process.env.AMAZON_BUCKET,
  AMAZON_REGION: process.env.AMAZON_REGION,
  AMAZON_URL: process.env.AMAZON_URL,
  AMAZON_PARTNER_ID: process.env.AMAZON_PARTNER_ID,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL,
  FROM_MAIL_ADDRESS: process.env.FROM_MAIL_ADDRESS,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  CERTIFIED_RATIO: Number(process.env.CERTIFIED_RATIO),
  PUBLICATION_TIME_IN_DAYS: Number(process.env.PUBLICATION_TIME_IN_DAYS),
  LONG_SIGN_IN_DURATION: process.env.LONG_SIGN_IN_DURATION,
  SHORT_SIGN_IN_DURATION: process.env.SHORT_SIGN_IN_DURATION,
  PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES: Number(
    process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES
  ),
  MIN_PASSWORD_LENGTH: process.env.MIN_PASSWORD_LENGTH,
} as const;

export const configs = z
  .object<Record<keyof typeof configsToCheck, ZodTypeAny>>({
    MONGODB_URI: z.string().url(),
    MONGO_LOCAL_URL: z.string(),
    JWT_KEY: z.string(),
    PORT: z.string(),
    FRONTEND_URL: z.string(),
    FRONTEND_LOCAL_URL: z.string(),
    PAYPAL_CLIENT_ID: z.string(),
    PAYPAL_CLIENT_SECRET: z.string(),
    PAYPAL_WEBHOOK_ID: z.string(),
    PAYPAL_WEBHOOK_SECRET: z.string(),
    AMAZON_ID: z.string(),
    AMAZON_SECRET: z.string(),
    AMAZON_BUCKET: z.string(),
    AMAZON_REGION: z.string(),
    AMAZON_URL: z.string().url(),
    AMAZON_PARTNER_ID: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    FACEBOOK_CLIENT_ID: z.string(),
    FACEBOOK_CLIENT_SECRET: z.string(),
    FACEBOOK_CALLBACK_URL: z.string().url(),
    FROM_MAIL_ADDRESS: z.string().email(),
    SALT_ROUNDS: z.number().min(0).default(10),
    CERTIFIED_RATIO: z.number().min(0).max(1).default(0.3),
    PUBLICATION_TIME_IN_DAYS: z.number().min(0).max(365).default(30),
    LONG_SIGN_IN_DURATION: z.string().default("7d"),
    SHORT_SIGN_IN_DURATION: z.string().default("1h"),
    PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES: z.number().min(0).max(100).default(15),
    MIN_PASSWORD_LENGTH: z.number().min(1).default(8),
  })
  .parse(configsToCheck);
