/* eslint-disable no-underscore-dangle */
import { ZodFirstPartyTypeKind } from "zod";
export const isZodArray = (type) => type._def.typeName === ZodFirstPartyTypeKind.ZodArray;
export const isZodObject = (type) => type._def.typeName === ZodFirstPartyTypeKind.ZodObject;
export const isZodUnion = (type) => type._def.typeName === ZodFirstPartyTypeKind.ZodUnion;
export const isZodDiscriminatedUnion = (type) => type._def.typeName === ZodFirstPartyTypeKind.ZodDiscriminatedUnion;
export const isZodIntersection = (type) => type._def.typeName === ZodFirstPartyTypeKind.ZodIntersection;
