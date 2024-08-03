/* eslint-disable no-underscore-dangle */
import { ZodDiscriminatedUnion, ZodEnum, ZodObject, ZodUnion } from "zod";
import { getZodUnionOptions } from "./getZodUnionOptions.js";
import { isZodObject } from "./typeGuards.js";

export const getZodObjectKeys = (properties: ZodObject<any> | ZodUnion<[ZodObject<any>]> | ZodDiscriminatedUnion<any, any>): Array<string> => {
    if (isZodObject(properties)) {
        const props: ZodEnum<[string]> = properties.keyof();
        return props.options;
    }
    const options = getZodUnionOptions(properties);
    if (options === "mixed") throw new Error("ZodUnion/.or options are not all ZodObjects");
    return options.reduce<Array<string>>((acc, curr) => {
        return [...acc, ...getZodObjectKeys(curr)];
    }, []);
};
