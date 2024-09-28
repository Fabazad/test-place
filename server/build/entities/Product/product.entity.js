
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="dd29fd23-3292-5fdc-8518-69ddc32c699c")}catch(e){}}();
import { savedDataSchema } from "../../utils/savedDataSchema.js";
import z from "zod";
export const PRODUCT_CATEGORIES = [
    "pet-shop",
    "auto-moto",
    "baggage",
    "beauty-perfume",
    "jewelry",
    "housing",
    "baby",
    "shoes-bags",
    "kitchen-house",
    "grocery",
    "office-supplies",
    "appliances",
    "electronics",
    "higiene-health",
    "computeur-science",
    "music",
    "garden",
    "games",
    "video-games",
    "lights",
    "mode",
    "watch",
    "sports",
    "cloths",
];
export const productDataSchema = z.object({
    asin: z.string(),
    title: z.string(),
    price: z.number().min(0),
    finalPrice: z.number().min(0),
    description: z.string(),
    isPrime: z.boolean(),
    maxDemands: z.number().min(0),
    automaticAcceptance: z.boolean(),
    imageUrls: z.array(z.string()),
    category: z.enum(PRODUCT_CATEGORIES),
    seller: z.string({ description: "User" }),
    amazonSeller: z.object({
        name: z.string(),
        url: z.string(),
    }),
    publishDate: z.date().optional(),
    publishExpirationDate: z.date().nullish(),
    keywords: z.array(z.string()).optional(),
    privateNote: z.string().optional(),
    remainingTestsCount: z.number(),
});
export const productSchema = productDataSchema
    .extend(savedDataSchema)
    .extend({ amazonUrl: z.string() });
//# sourceMappingURL=product.entity.js.map
//# debugId=dd29fd23-3292-5fdc-8518-69ddc32c699c
