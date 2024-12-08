
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9d5af77c-4745-5102-a7dd-9d2163a2fb88")}catch(e){}}();
import { configs } from "../../configs.js";
import { booleanSchema, numberSchema } from "../../utils/zod.utils.js";
import z from "zod";
import { PRODUCT_CATEGORIES, productDataSchema } from "./product.entity.js";
export const isProductCategory = (category) => PRODUCT_CATEGORIES.includes(category);
export const ProductSortBy = {
    CREATED_AT: "createdAt",
    SCORE: "score",
    PRICE: "price",
    FINAL_PRICE: "finalPrice",
};
export const productSearchDataSchema = z.object({
    category: z.enum(PRODUCT_CATEGORIES).optional(),
    keyWords: z.string().optional(),
    minPrice: numberSchema({ min: 0 }).optional(),
    maxPrice: numberSchema({ min: 0 }).optional(),
    free: booleanSchema().optional(),
    automaticAcceptance: booleanSchema().optional(),
    prime: booleanSchema().optional(),
    itemsPerPage: numberSchema({ min: 1, max: 100 }),
    page: numberSchema({ min: 1 }),
    sortBy: z.nativeEnum(ProductSortBy).optional().default(ProductSortBy.CREATED_AT),
    published: booleanSchema().optional(),
    remainingRequests: booleanSchema().optional(),
    seller: z.string().optional(),
    isCertified: booleanSchema().optional(),
});
export const productUpdateDataSchema = productDataSchema.pick({
    title: true,
    description: true,
    isPrime: true,
    maxDemands: true,
    automaticAcceptance: true,
    keywords: true,
    privateNote: true,
    imageUrls: true,
    category: true,
    price: true,
    finalPrice: true,
});
export const generateAmazonUrl = (product) => {
    const formattedKeywords = product.keywords?.join("+");
    const keywordsQuery = formattedKeywords ? `keywords=${formattedKeywords}` : "";
    const baseAmazonUrl = `https://www.amazon.fr/dp/${product.asin}?${keywordsQuery}&tag=${configs.AMAZON_AFFILIATION_TAG}${product.amazonMerchantId ? `&m=${product.amazonMerchantId}` : ""}`;
    const amazonUrl = `${configs.BRIDGE_SITE_URL}?${configs.BRIDGE_SITE_PARAMS_KEY}=${encodeURIComponent(baseAmazonUrl)}`;
    return amazonUrl;
};
//# sourceMappingURL=product.constants.js.map
//# debugId=9d5af77c-4745-5102-a7dd-9d2163a2fb88
