import { UserWithoutPassword } from "@/entities/User/user.entity.js";
import { savedDataSchema } from "@/utils/savedDataSchema.js";
import z from "zod";
import { PRODUCT_CATEGORIES } from "./product.constants.js";

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

export type ProductData = z.infer<typeof productDataSchema>;

export const productSchema = productDataSchema.extend(savedDataSchema);
export type Product = z.infer<typeof productSchema>;

export type PopulatedProduct = Omit<Product, "seller"> & { seller: UserWithoutPassword };
