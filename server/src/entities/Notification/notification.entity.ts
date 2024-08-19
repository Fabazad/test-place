import { NotificationType } from "@/utils/constants.js";
import { getEnumValues } from "@/utils/enum.js";
import { savedDataSchema } from "@/utils/savedDataSchema.js";
import z from "zod";
import { productSchema } from "../Product/product.entity.js";
import { testSchema } from "../Test/test.entity.js";

export const notificationDataSchema = z.object({
  product: productSchema,
  test: testSchema,
  user: z.string({ description: "User" }),
  type: z.enum(getEnumValues(NotificationType)),
  viewDate: z.date().nullish(),
});
export type NotificationData = z.infer<typeof notificationDataSchema>;

export const notificationSchema = notificationDataSchema.extend(savedDataSchema);
export type Notification = z.infer<typeof notificationSchema>;
