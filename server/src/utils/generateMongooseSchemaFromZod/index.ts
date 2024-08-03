import defaultsDeep from "lodash/defaultsDeep.js";
import { SchemaDefinition } from "mongoose";
import { ZodDiscriminatedUnion, ZodIntersection, ZodObject, ZodUnion } from "zod";
import { generateMongooseSchemaFromZodRec } from "./generateMongooseSchemaFromZodRec.js";

export const ID_AT_ROOT_ERROR = "Id at root is not supported";

export const generateMongooseSchemaFromZod = (
    properties: ZodObject<any> | ZodUnion<any> | ZodDiscriminatedUnion<string, any> | ZodIntersection<any, any>,
    overrideSchema?: SchemaDefinition,
    removeIdsFromSchema?: boolean,
    schemaOptions: { typedKey: string } = { typedKey: "type" },
): SchemaDefinition => {
    const generated = generateMongooseSchemaFromZodRec(properties, undefined, removeIdsFromSchema, schemaOptions);
    const result = overrideSchema ? defaultsDeep(overrideSchema, generated) : generated;

    if (Object.keys(result).includes("_id")) throw new Error(ID_AT_ROOT_ERROR);

    return result;
};
