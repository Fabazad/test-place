
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a6417fa9-ae0f-5ef2-91cf-2c3683f36291")}catch(e){}}();
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
//# sourceMappingURL=getZodObjectKeys.js.map
//# debugId=a6417fa9-ae0f-5ef2-91cf-2c3683f36291
