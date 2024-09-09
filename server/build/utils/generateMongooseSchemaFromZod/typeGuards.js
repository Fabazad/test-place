/* eslint-disable no-underscore-dangle */

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="067441d8-3df0-599f-bf8a-a83c97c20047")}catch(e){}}();
import { ZodFirstPartyTypeKind } from "zod";
export const isZodArray = (type) => type._def.typeName === ZodFirstPartyTypeKind.ZodArray;
export const isZodObject = (type) => type._def.typeName === ZodFirstPartyTypeKind.ZodObject;
export const isZodUnion = (type) => type._def.typeName === ZodFirstPartyTypeKind.ZodUnion;
export const isZodDiscriminatedUnion = (type) => type._def.typeName === ZodFirstPartyTypeKind.ZodDiscriminatedUnion;
export const isZodIntersection = (type) => type._def.typeName === ZodFirstPartyTypeKind.ZodIntersection;
//# sourceMappingURL=typeGuards.js.map
//# debugId=067441d8-3df0-599f-bf8a-a83c97c20047
