/* eslint-disable no-underscore-dangle */
import { ZodFirstPartyTypeKind } from "zod";
import { isZodObject } from "./typeGuards.js";
export const NOT_OBJECT_IN_UNION_ERROR = "ZodUnion/.or options are not all ZodObjects";
export const getZodUnionOptions = (zodUnion) => {
    if (zodUnion._def.typeName === ZodFirstPartyTypeKind.ZodDiscriminatedUnion) {
        return zodUnion._def.options;
    }
    if (zodUnion._def.options.every(isZodObject)) {
        return zodUnion._def.options;
    }
    return "mixed";
};
