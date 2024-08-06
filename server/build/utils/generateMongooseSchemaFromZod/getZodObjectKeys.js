import { getZodUnionOptions } from "./getZodUnionOptions.js";
import { isZodObject } from "./typeGuards.js";
export const getZodObjectKeys = (properties) => {
    if (isZodObject(properties)) {
        const props = properties.keyof();
        return props.options;
    }
    const options = getZodUnionOptions(properties);
    if (options === "mixed")
        throw new Error("ZodUnion/.or options are not all ZodObjects");
    return options.reduce((acc, curr) => {
        return [...acc, ...getZodObjectKeys(curr)];
    }, []);
};
