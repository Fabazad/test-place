import { configs } from "@/configs.js";
import { InferEnum } from "@/utils/inferEnum.js";
import { booleanSchema, numberSchema } from "@/utils/zod.utils.js";
import z from "zod";
import { Product, PRODUCT_CATEGORIES, productDataSchema } from "./product.entity.js";

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export const isProductCategory = (category: string): category is ProductCategory =>
  PRODUCT_CATEGORIES.includes(category as ProductCategory);

export const ProductSortBy = {
  CREATED_AT: "createdAt",
  SCORE: "score",
  PRICE: "price",
  FINAL_PRICE: "finalPrice",
} as const;
export type ProductSortBy = InferEnum<typeof ProductSortBy>;

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
});
export type ProductSearchData = z.infer<typeof productSearchDataSchema>;

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

export type ProductUpdateData = z.infer<typeof productUpdateDataSchema>;

export const generateAmazonUrl = (product: Product): string => {
  const formattedKeywords = product.keywords?.join("+");
  const keywordsQuery = formattedKeywords ? `keywords=${formattedKeywords}` : "";
  return `https://www.amazon.fr/dp/${product.asin}?${keywordsQuery}&tag=${
    configs.AMAZON_AFFILIATION_TAG
  }${product.amazonMerchantId ? `&m=${product.amazonMerchantId}` : ""}`;
};
