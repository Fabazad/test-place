import { UserWithoutPassword } from "@/entities/User/user.entity.js";
import { savedDataSchema } from "@/utils/savedDataSchema.js";
import z from "zod";

export const PRODUCT_CATEGORIES = [
  "aps",
  "alexa-skills",
  "amazon-global-store",
  "warehouse-deals",
  "pets",
  "amazon-devices",
  "mobile-apps",
  "automotive",
  "fashion-luggage",
  "beauty",
  "luxury-beauty",
  "gift-cards",
  "digital-text",
  "diy",
  "baby",
  "kitchen",
  "dvd",
  "grocery",
  "office-products",
  "appliances",
  "handmade",
  "electronics",
  "hpc",
  "computers",
  "mi",
  "garden",
  "toys",
  "videogames",
  "stripbooks",
  "audible",
  "software",
  "lighting",
  "luxury",
  "fashion",
  "fashion-womens",
  "fashion-mens",
  "fashion-girls",
  "fashion-boys",
  "fashion-baby",
  "under-ten-dollars",
  "monoprix",
  "popular",
  "classical",
  "instant-video",
  "specialty-aps-sns",
  "industrial",
  "sports",
  "digital-music",
  "todays-deals",
] as const;

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
  category: z.enum(PRODUCT_CATEGORIES).optional(),
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

export const productSchema = productDataSchema
  .extend(savedDataSchema)
  .extend({ amazonUrl: z.string() });
export type Product = z.infer<typeof productSchema>;

export type PopulatedProduct = Omit<Product, "seller"> & { seller: UserWithoutPassword };
