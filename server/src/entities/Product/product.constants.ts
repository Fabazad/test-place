import { InferEnum } from "@/utils/inferEnum.js";
import { booleanSchema, numberSchema } from "@/utils/zod.utils.js";
import z from "zod";
import { PRODUCT_CATEGORIES, productDataSchema } from "./product.entity.js";

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

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
  published: booleanSchema(),
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
