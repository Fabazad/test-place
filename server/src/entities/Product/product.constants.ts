import { InferEnum } from "@/utils/inferEnum";
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
] as const;

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
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  free: z.boolean().optional(),
  automaticAcceptance: z.boolean().optional(),
  prime: z.boolean().optional(),
  itemsPerPage: z.number().min(1).max(100),
  page: z.number().min(1),
  sortBy: z.nativeEnum(ProductSortBy),
  published: z.boolean(),
  remainingRequests: z.number().min(1).optional(),
  seller: z.string().optional(),
});
export type ProductSearchData = z.infer<typeof productSearchDataSchema>;
