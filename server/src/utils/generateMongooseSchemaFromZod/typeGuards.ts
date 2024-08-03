/* eslint-disable no-underscore-dangle */
import { ZodArray, ZodDiscriminatedUnion, ZodFirstPartySchemaTypes, ZodFirstPartyTypeKind, ZodIntersection, ZodObject, ZodUnion } from "zod";

export const isZodArray = (type: ZodFirstPartySchemaTypes): type is ZodArray<any> => type._def.typeName === ZodFirstPartyTypeKind.ZodArray;
export const isZodObject = (type: ZodFirstPartySchemaTypes): type is ZodObject<any> => type._def.typeName === ZodFirstPartyTypeKind.ZodObject;
export const isZodUnion = (type: ZodFirstPartySchemaTypes): type is ZodUnion<any> => type._def.typeName === ZodFirstPartyTypeKind.ZodUnion;
export const isZodDiscriminatedUnion = (type: ZodFirstPartySchemaTypes): type is ZodDiscriminatedUnion<string, any> =>
    type._def.typeName === ZodFirstPartyTypeKind.ZodDiscriminatedUnion;
export const isZodIntersection = (type: ZodFirstPartySchemaTypes): type is ZodIntersection<any, any> =>
    type._def.typeName === ZodFirstPartyTypeKind.ZodIntersection;
