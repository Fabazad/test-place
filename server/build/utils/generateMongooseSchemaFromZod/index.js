import defaultsDeep from "lodash/defaultsDeep.js";
import { generateMongooseSchemaFromZodRec } from "./generateMongooseSchemaFromZodRec.js";
export const ID_AT_ROOT_ERROR = "Id at root is not supported";
export const generateMongooseSchemaFromZod = (properties, overrideSchema, removeIdsFromSchema, schemaOptions = { typedKey: "type" }) => {
    const generated = generateMongooseSchemaFromZodRec(properties, undefined, removeIdsFromSchema, schemaOptions);
    const result = overrideSchema ? defaultsDeep(overrideSchema, generated) : generated;
    if (Object.keys(result).includes("_id"))
        throw new Error(ID_AT_ROOT_ERROR);
    return result;
};
