import { BadRequestError } from "./exceptions/index.js";
import { formatZodError } from "./formatZodError.js";
export const zodValidationForRoute = (data, schema) => {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new BadRequestError("bad-request", formatZodError(result.error));
    }
    return result.data;
};
