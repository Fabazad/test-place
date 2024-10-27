
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="1959e2d2-0f86-54d9-9bf7-b62bccfd9ce9")}catch(e){}}();
import z from "zod";
export const savedDataSchema = {
    createdAt: z.date(),
    updatedAt: z.date(),
    _id: z.string(),
};
export const omittedSavedDataSchema = {
    createdAt: true,
    updatedAt: true,
    _id: true,
};
//# sourceMappingURL=savedDataSchema.js.map
//# debugId=1959e2d2-0f86-54d9-9bf7-b62bccfd9ce9
