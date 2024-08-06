import { z } from "zod";
export const numberSchema = ({ max, min, defaultValue, } = {}) => {
    let number = z.number();
    if (max !== undefined) {
        number = number.max(max);
    }
    if (min !== undefined) {
        number = number.min(min);
    }
    if (defaultValue !== undefined) {
        number.default(defaultValue);
    }
    return z.preprocess((val) => {
        if (typeof val === "string") {
            const parsed = Number(val);
            if (isNaN(parsed)) {
                return undefined;
            }
            return parsed;
        }
        return val;
    }, number);
};
export const booleanSchema = () => {
    return z.preprocess((val) => {
        if (typeof val === "string") {
            if (val.toLowerCase() === "true")
                return true;
            if (val.toLowerCase() === "false")
                return false;
        }
        if (typeof val === "number") {
            return val === 1; // Convert 1 to true and other numbers to false
        }
        return val; // Return the value as-is if it's not a string or number
    }, z.boolean());
};
