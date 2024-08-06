import "dotenv/config";
import z from "zod";
const envNumber = (key) => {
    if (key === undefined)
        return undefined;
    const n = Number(key);
    if (isNaN(n))
        return undefined;
    return n;
};
const configsToCheck = {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_KEY: process.env.JWT_KEY,
    PORT: process.env.PORT,
    SALT_ROUNDS: envNumber(process.env.SALT_ROUNDS),
    CERTIFIED_RATIO: envNumber(process.env.CERTIFIED_RATIO),
    PUBLICATION_TIME_IN_DAYS: envNumber(process.env.PUBLICATION_TIME_IN_DAYS),
    LONG_SIGN_IN_DURATION: process.env.LONG_SIGN_IN_DURATION,
    SHORT_SIGN_IN_DURATION: process.env.SHORT_SIGN_IN_DURATION,
    PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES: envNumber(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES),
    MIN_PASSWORD_LENGTH: process.env.MIN_PASSWORD_LENGTH,
};
const checkConfigs = (c, schema) => {
    return schema.parse(c);
};
export const configs = checkConfigs(configsToCheck, z.object({
    MONGODB_URI: z.string().url(),
    JWT_KEY: z.string(),
    PORT: z.string(),
    SALT_ROUNDS: z.number().min(0).optional().default(10),
    CERTIFIED_RATIO: z.number().min(0).max(1).optional().default(0.3),
    PUBLICATION_TIME_IN_DAYS: z.number().min(0).max(365).optional().default(30),
    LONG_SIGN_IN_DURATION: z.string().optional().default("7d"),
    SHORT_SIGN_IN_DURATION: z.string().optional().default("1h"),
    PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES: z
        .number()
        .min(0)
        .max(100)
        .optional()
        .default(15),
    MIN_PASSWORD_LENGTH: z.number().min(1).optional().default(8),
}));
