
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="03171a0e-1bc8-54f2-a815-bae514f60756")}catch(e){}}();
import { savedDataSchema } from "../../utils/savedDataSchema.js";
import z from "zod";
import { productSchema } from "../Product/product.entity.js";
import { TestStatus } from "./test.constants.js";
export const testDataSchema = z.object({
    product: productSchema,
    seller: z.string({ description: "User" }),
    tester: z.string({ description: "User" }),
    status: z.nativeEnum(TestStatus),
    updates: z.array(z.object({
        date: z.date(),
        status: z.nativeEnum(TestStatus),
    })),
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
export const testSchema = testDataSchema.extend(savedDataSchema);
//# sourceMappingURL=test.entity.js.map
//# debugId=03171a0e-1bc8-54f2-a815-bae514f60756
