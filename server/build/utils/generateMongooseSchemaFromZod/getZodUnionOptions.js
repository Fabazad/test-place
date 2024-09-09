/* eslint-disable no-underscore-dangle */

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a4d040a6-5db9-5266-8c87-68502808b19f")}catch(e){}}();
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
//# sourceMappingURL=getZodUnionOptions.js.map
//# debugId=a4d040a6-5db9-5266-8c87-68502808b19f
