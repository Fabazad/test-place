
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9c246d1b-effa-5ef5-9cd4-c3f79068d7b8")}catch(e){}}();
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
    "high-tech",
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
//# debugId=9c246d1b-effa-5ef5-9cd4-c3f79068d7b8
