
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="5cd673c3-f117-54c2-8af2-016a0f14f7cf")}catch(e){}}();
import { BadRequestError } from "./exceptions/index.js";
import { formatZodError } from "./formatZodError.js";
export const zodValidationForRoute = (data, schema) => {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new BadRequestError("bad-request", formatZodError(result.error));
    }
    return result.data;
};
//# sourceMappingURL=zodValidationForRoute.js.map
//# debugId=5cd673c3-f117-54c2-8af2-016a0f14f7cf
