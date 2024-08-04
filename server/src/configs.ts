import "dotenv/config";
import z from "zod";

const configsToCheck = {
  MONGODB_URI: process.env.MONGODB_URI,
  MONGO_LOCAL_URL: process.env.MONGO_LOCAL_URL,
  JWT_KEY: process.env.JWT_KEY,
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  FRONTEND_LOCAL_URL: process.env.FRONTEND_LOCAL_URL,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
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
  SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
  CERTIFIED_RATIO: Number(process.env.CERTIFIED_RATIO) || 0.3,
  PUBLICATION_TIME_IN_DAYS: Number(process.env.PUBLICATION_TIME_IN_DAYS) || 30,
} as const;

export const configs = z
  .object({
    MONGODB_URI: z.string().url(),
    MONGO_LOCAL_URL: z.string(),
    JWT_KEY: z.string(),
    PORT: z.string(),
    FRONTEND_URL: z.string(),
    FRONTEND_LOCAL_URL: z.string(),
    SENDGRID_API_KEY: z.string(),
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
    SALT_ROUNDS: z.number().min(0),
    CERTIFIED_RATIO: z.number().min(0).max(1),
    PUBLICATION_TIME_IN_DAYS: z.number().min(0).max(365),
  })
  .parse(configsToCheck);
