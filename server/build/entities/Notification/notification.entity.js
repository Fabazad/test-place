import { NotificationType } from "../../utils/constants.js";
import { getEnumValues } from "../../utils/enum.js";
import { Language } from "../../utils/Language.js";
import { savedDataSchema } from "../../utils/savedDataSchema.js";
import z from "zod";
import { productSchema } from "../Product/product.entity.js";
import { testSchema } from "../Test/test.entity.js";
export const notificationDataSchema = z.object({
    product: productSchema,
    test: testSchema,
    user: z.object({
        name: z.string(),
        email: z.string(),
        language: z.nativeEnum(Language),
    }),
    type: z.enum(getEnumValues(NotificationType)),
    viewDate: z.date().nullish(),
});
export const notificationSchema = notificationDataSchema.extend(savedDataSchema);
