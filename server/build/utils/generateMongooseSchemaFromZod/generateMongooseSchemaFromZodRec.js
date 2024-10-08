/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="62b63108-bf7c-5f6a-bf6e-a9eb224dec8b")}catch(e){}}();
import defaultsDeep from "lodash/defaultsDeep.js";
import { Schema as MongooseSchema, Types, } from "mongoose";
import { ZodFirstPartyTypeKind, } from "zod";
import { getNativEnumData } from "./getNativEnumData.js";
import { getZodObjectKeys } from "./getZodObjectKeys.js";
import { getZodUnionOptions } from "./getZodUnionOptions.js";
import { isZodArray, isZodDiscriminatedUnion, isZodIntersection, isZodObject, isZodUnion, } from "./typeGuards.js";
export const UNION_WITH_NOT_OBJECT_AT_ROOT_ERROR = "Union with not object type at root is not supported";
const generateMongoosePropertyFromZodRec = (properties, required = true, defaultValue = undefined, schemaOptions = { typedKey: "type" }) => {
    const propertiesDef = properties._def;
    const propertiesZodType = propertiesDef.typeName;
    const requiredField = required ? {} : { required: false };
    const { typedKey } = schemaOptions;
    if (properties._def.typeName === ZodFirstPartyTypeKind.ZodOptional ||
        properties._def.typeName === ZodFirstPartyTypeKind.ZodNullable) {
        const { innerType } = properties._def;
        return generateMongoosePropertyFromZodRec(innerType, false, undefined, schemaOptions);
    }
    if (properties._def.typeName === ZodFirstPartyTypeKind.ZodDefault) {
        const { innerType } = properties._def;
        return generateMongoosePropertyFromZodRec(innerType, required, properties._def.defaultValue(), schemaOptions);
    }
    if (isZodObject(properties)) {
        const _id = getZodObjectKeys(properties).includes("_id");
        return {
            ...requiredField,
            [typedKey]: generateMongooseSchemaFromZodRec(properties, undefined, undefined, schemaOptions),
            ...(defaultValue && { default: defaultValue }),
            ...(_id ? {} : { _id: false }),
        };
    }
    if (isZodArray(properties)) {
        if (isZodObject(properties.element) ||
            isZodUnion(properties.element) ||
            isZodDiscriminatedUnion(properties.element)) {
            const generated = generateMongooseSchemaFromZodRec(properties.element, undefined, undefined, schemaOptions);
            const hasId = "_id" in generated;
            if (hasId)
                delete generated._id;
            return {
                ...requiredField,
                [typedKey]: [generated],
                ...(defaultValue && { default: defaultValue }),
                ...(hasId ? {} : { _id: false }),
            };
        }
        return {
            ...requiredField,
            [typedKey]: [
                generateMongoosePropertyFromZodRec(properties.element, undefined, undefined, schemaOptions),
            ],
            ...(defaultValue && { default: defaultValue }),
        };
    }
    if (properties._def.typeName === ZodFirstPartyTypeKind.ZodString) {
        if (properties._def.description) {
            return {
                ...requiredField,
                [typedKey]: Types.ObjectId,
                ref: properties._def.description,
            };
        }
        const maxCheck = properties._def.checks.find((check) => check.kind === "max");
        const minCheck = properties._def.checks.find((check) => check.kind === "min");
        const min = minCheck?.value;
        const max = maxCheck?.value;
        return {
            ...requiredField,
            [typedKey]: String,
            ...(defaultValue && { default: defaultValue }),
            ...(min !== undefined && { min }),
            ...(max && { max }),
        };
    }
    if (propertiesZodType === ZodFirstPartyTypeKind.ZodNativeEnum) {
        const { type, elements } = getNativEnumData(propertiesDef);
        return {
            ...requiredField,
            [typedKey]: type,
            ...(defaultValue && { default: defaultValue }),
            enum: elements,
        };
    }
    if (propertiesZodType === ZodFirstPartyTypeKind.ZodDate) {
        return {
            ...requiredField,
            [typedKey]: Date,
            ...(defaultValue && { default: defaultValue }),
        };
    }
    if (propertiesZodType === ZodFirstPartyTypeKind.ZodBoolean) {
        return {
            ...requiredField,
            [typedKey]: Boolean,
            ...(defaultValue && { default: defaultValue }),
        };
    }
    if (propertiesZodType === ZodFirstPartyTypeKind.ZodNumber) {
        const maxCheck = propertiesDef.checks.find((check) => check.kind === "max");
        const minCheck = propertiesDef.checks.find((check) => check.kind === "min");
        const max = maxCheck
            ? maxCheck.inclusive
                ? maxCheck.value
                : maxCheck.value - 1
            : undefined;
        const min = minCheck
            ? minCheck.inclusive
                ? minCheck.value
                : minCheck.value - 1
            : undefined;
        return {
            ...requiredField,
            [typedKey]: Number,
            ...(defaultValue !== undefined && { default: defaultValue }),
            ...(max && { max }),
            ...(min !== undefined && { min }),
        };
    }
    if (propertiesZodType === ZodFirstPartyTypeKind.ZodEnum) {
        const { values } = propertiesDef;
        return {
            ...requiredField,
            [typedKey]: String,
            ...(defaultValue && { default: defaultValue }),
            enum: values,
        };
    }
    if (propertiesZodType === ZodFirstPartyTypeKind.ZodLiteral) {
        return {
            ...requiredField,
            [typedKey]: String,
            ...(defaultValue && { default: defaultValue }),
        };
    }
    if (propertiesZodType === ZodFirstPartyTypeKind.ZodRecord) {
        const keyType = propertiesDef.keyType._def;
        if (keyType.typeName === ZodFirstPartyTypeKind.ZodNativeEnum) {
            const { type, elements } = getNativEnumData(keyType);
            if (type === String) {
                return {
                    ...requiredField,
                    [typedKey]: elements.reduce((acc, curr) => ({ ...acc, [curr]: { [typedKey]: String, ...requiredField } }), {}),
                };
            }
        }
        if (keyType.typeName === ZodFirstPartyTypeKind.ZodEnum) {
            const values = keyType.values;
            return {
                ...requiredField,
                [typedKey]: values.reduce((acc, curr) => ({ ...acc, [curr]: { [typedKey]: String, ...requiredField } }), {}),
            };
        }
        return { ...requiredField, [typedKey]: {} };
    }
    if (properties._def.typeName === ZodFirstPartyTypeKind.ZodEffects) {
        return generateMongoosePropertyFromZodRec(properties._def.schema, required, defaultValue, schemaOptions);
    }
    if (properties._def.typeName === ZodFirstPartyTypeKind.ZodIntersection) {
        const generated = defaultsDeep(generateMongooseSchemaFromZodRec(properties._def.left, required, undefined, schemaOptions), generateMongooseSchemaFromZodRec(properties._def.right, required, undefined, schemaOptions));
        return {
            ...requiredField,
            [typedKey]: generated,
            ...("_id" in generated ? {} : { _id: false }),
        };
    }
    if (properties._def.typeName === ZodFirstPartyTypeKind.ZodAny) {
        return { ...requiredField, [typedKey]: MongooseSchema.Types.Mixed };
    }
    throw new Error(`Type ${propertiesZodType} not supported`);
};
export const generateMongooseSchemaFromZodRec = (properties, required = true, removeIdsFromSchema = false, schemaOptions = { typedKey: "type" }) => {
    const requiredField = required ? {} : { required };
    const { typedKey } = schemaOptions;
    if (isZodIntersection(properties)) {
        return defaultsDeep(generateMongooseSchemaFromZodRec(properties._def.left, required, removeIdsFromSchema, schemaOptions), generateMongooseSchemaFromZodRec(properties._def.right, required, removeIdsFromSchema, schemaOptions));
    }
    if (isZodUnion(properties)) {
        const options = getZodUnionOptions(properties);
        if (options === "mixed")
            throw new Error(UNION_WITH_NOT_OBJECT_AT_ROOT_ERROR);
        return options.reduce((acc, curr) => {
            return defaultsDeep(acc, generateMongooseSchemaFromZodRec(curr, false, removeIdsFromSchema, schemaOptions));
        }, {});
    }
    if (isZodDiscriminatedUnion(properties)) {
        const propertiesDef = properties._def;
        const { discriminator, options, optionsMap } = propertiesDef;
        const enumValues = [...optionsMap.keys()];
        const preRes = options.reduce((acc, curr) => {
            return defaultsDeep(acc, generateMongooseSchemaFromZodRec(curr, false, removeIdsFromSchema, schemaOptions));
        }, {});
        return {
            ...preRes,
            [discriminator]: { [typedKey]: String, enum: enumValues, ...requiredField },
        };
    }
    const objectKeys = getZodObjectKeys(properties);
    return objectKeys.reduce((acc, curr) => {
        const prop = properties.shape[curr];
        if (isZodObject(prop)) {
            const _id = getZodObjectKeys(prop).includes("_id");
            return {
                ...acc,
                [curr]: {
                    ...requiredField,
                    [typedKey]: generateMongooseSchemaFromZodRec(prop, required, removeIdsFromSchema, schemaOptions),
                    ...(_id ? {} : { _id: false }),
                },
            };
        }
        if (isZodUnion(prop)) {
            const options = getZodUnionOptions(prop);
            if (options === "mixed")
                return {
                    ...acc,
                    [curr]: { ...requiredField, [typedKey]: MongooseSchema.Types.Mixed },
                };
            const _id = getZodObjectKeys(prop).includes("_id");
            return defaultsDeep(acc, {
                [curr]: {
                    ...requiredField,
                    [typedKey]: generateMongooseSchemaFromZodRec(prop, required, removeIdsFromSchema, schemaOptions),
                    ...(_id ? {} : { _id: false }),
                },
            });
        }
        if (isZodDiscriminatedUnion(prop)) {
            const _id = getZodObjectKeys(prop).includes("_id");
            return defaultsDeep(acc, {
                [curr]: {
                    ...requiredField,
                    [typedKey]: generateMongooseSchemaFromZodRec(prop, required, removeIdsFromSchema, schemaOptions),
                    ...(_id ? {} : { _id: false }),
                },
            });
        }
        if (removeIdsFromSchema && curr === "_id")
            return acc;
        return {
            ...acc,
            [curr]: generateMongoosePropertyFromZodRec(properties.shape[curr], required, undefined, schemaOptions),
        };
    }, {});
};
//# sourceMappingURL=generateMongooseSchemaFromZodRec.js.map
//# debugId=62b63108-bf7c-5f6a-bf6e-a9eb224dec8b
