
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="20e30489-5a2d-54ea-bf8c-22517ae9ceb3")}catch(e){}}();
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
//# sourceMappingURL=index.js.map
//# debugId=20e30489-5a2d-54ea-bf8c-22517ae9ceb3
