import { TestStatus } from "@/utils/constants";
import { savedDataSchema } from "@/utils/savedDataSchema";
import z from "zod";
import { productSchema } from "../Product/product.entity";
import { User } from "../User/user.entity";

export const testDataSchema = z.object({
  product: productSchema,
  seller: z.string({ description: "User" }),
  tester: z.string({ description: "User" }),
  status: z.nativeEnum(TestStatus),
  updates: z.array(
    z.object({
      date: z.date(),
      status: z.nativeEnum(TestStatus),
    })
  ),
  testerMessage: z.string().optional(),
  cancelRequestReason: z.string().optional(),
  declineRequestReason: z.string().optional(),
  sellerMessage: z.string().optional(),
  orderId: z.string().optional(),
  declineReviewReason: z.string().optional(),
  expirationDate: z.date().nullish(),
  orderScreenshotUrl: z.string().optional(),
  reviewId: z.string().optional(),
  cancelReason: z.string().optional(),
  adminMessage: z.string().optional(),
  cancellationGuilty: z.string({ description: "User" }).optional(),
});
export type TestData = z.infer<typeof testDataSchema>;

export const testSchema = testDataSchema.extend(savedDataSchema);
export type Test = z.infer<typeof testSchema>;

export type PopulatedTest = Omit<Test, "seller" | "tester"> & {
  seller: User;
  tester: User;
};
