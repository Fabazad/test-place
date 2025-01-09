import { InferEnum } from "@/utils/inferEnum.js";
import { savedDataSchema } from "@/utils/savedDataSchema.js";
import z from "zod";
import { productSchema } from "../Product/product.entity.js";
import { UserWithoutPassword } from "../User/user.entity.js";
import { TestStatus } from "./test.constants.js";

export const MessageSenderType = {
  SELLER: "seller",
  TESTER: "tester",
  ADMIN: "admin",
} as const;
export type MessageSenderType = InferEnum<typeof MessageSenderType>;

export const testMessageSchema = z.object({
  message: z.string(),
  date: z.date(),
  sender: z.object({
    senderType: z.nativeEnum(MessageSenderType),
    userId: z.string(),
  }),
});
export type TestMessage = z.infer<typeof testMessageSchema>;

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
  reviewScreenshotUrl: z.string().optional(),
  messages: z.array(testMessageSchema).optional(),
});
export type TestData = z.infer<typeof testDataSchema>;

export const testSchema = testDataSchema.extend(savedDataSchema);
export type Test = z.infer<typeof testSchema>;

export type PopulatedTest = Omit<Test, "seller" | "tester"> & {
  seller: UserWithoutPassword;
  tester: UserWithoutPassword;
};
