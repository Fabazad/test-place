
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="150993ca-4d10-55ab-be14-c28cb764bfef")}catch(e){}}();
import { NotificationType } from "../../utils/constants.js";
import { getEnumValues } from "../../utils/enum.js";
import { savedDataSchema } from "../../utils/savedDataSchema.js";
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
export const notificationSchema = notificationDataSchema.extend(savedDataSchema);
//# sourceMappingURL=notification.entity.js.map
//# debugId=150993ca-4d10-55ab-be14-c28cb764bfef
