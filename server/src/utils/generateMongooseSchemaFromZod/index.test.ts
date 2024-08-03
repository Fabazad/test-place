import { Schema, SchemaDefinition, Types } from "mongoose";
import { z } from "zod";
import { UNION_WITH_NOT_OBJECT_AT_ROOT_ERROR } from "./generateMongooseSchemaFromZodRec.js";
import { generateMongooseSchemaFromZod, ID_AT_ROOT_ERROR } from "./index.js";

describe("generateMongooseSchemaFromZod", () => {
    describe("simple types", () => {
        it("should manage the string field", () => {
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.string() }));
            const expected: SchemaDefinition = {
                name: { type: String },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage the date field", () => {
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.date() }));
            const expected: SchemaDefinition = {
                name: { type: Date },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage the boolean field", () => {
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.boolean() }));
            const expected: SchemaDefinition = {
                name: { type: Boolean },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage numbers", () => {
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.number() }));
            const expected: SchemaDefinition = {
                name: { type: Number },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage the string nativeEnum type", () => {
            enum Test {
                A = "a",
                B = "b",
            }
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.nativeEnum(Test) }));
            const expected: SchemaDefinition = {
                name: { type: String, enum: Object.values(Test) },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage the number nativeEnum type", () => {
            enum Test {
                A = 1,
                B = 2,
            }
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.nativeEnum(Test) }));
            const expected: SchemaDefinition = {
                name: { type: Number, enum: [1, 2] },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage the string enum type", () => {
            const enumTest = ["a", "b"] as const;
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.enum(enumTest) }));
            const expected: SchemaDefinition = {
                name: { type: String, enum: enumTest },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage litterals", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    type: z.literal("bidule"),
                }),
            );
            const expected: SchemaDefinition = {
                type: {
                    type: String,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage any fields", () => {
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.any() }));
            const expected: SchemaDefinition = {
                name: { type: Schema.Types.Mixed },
            };
            expect(schema).toEqual(expected);
        });
    });

    describe("complex types", () => {
        it("should manage array of simple type", () => {
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.array(z.string()) }));
            const expected: SchemaDefinition = {
                name: {
                    type: [{ type: String }],
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage array of simple optional type", () => {
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.array(z.string().optional()) }));
            const expected: SchemaDefinition = {
                name: {
                    type: [{ type: String, required: false }],
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage optional array of simple type", () => {
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.array(z.string()).optional() }));
            const expected: SchemaDefinition = {
                name: {
                    required: false,
                    type: [{ type: String }],
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage array of object type", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    name: z.array(
                        z.object({
                            bidule: z.string(),
                        }),
                    ),
                }),
            );
            const expected: SchemaDefinition = {
                name: {
                    type: [{ bidule: { type: String } }],
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage union at root", () => {
            const schema = generateMongooseSchemaFromZod(z.union([z.object({ name: z.string() }), z.object({ age: z.number() })]));
            const expected: SchemaDefinition = {
                name: { required: false, type: String },
                age: { required: false, type: Number },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage union deeper", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.union([z.object({ min: z.number() }), z.object({ text: z.string() })]),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: {
                        min: { type: Number, required: false },
                        text: { type: String, required: false },
                    },
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage discrimated union at root", () => {
            const schema = generateMongooseSchemaFromZod(
                z.discriminatedUnion("type", [
                    z.object({ type: z.literal("name"), name: z.string() }),
                    z.object({ type: z.literal("age"), age: z.number() }),
                ]),
            );
            const expected: SchemaDefinition = {
                type: { type: String, enum: ["name", "age"] },
                name: { required: false, type: String },
                age: { required: false, type: Number },
            };

            expect(schema).toEqual(expected);
        });

        it("should manage discrimated union deeper", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.discriminatedUnion("type", [
                        z.object({ type: z.literal("min"), min: z.number() }),
                        z.object({ type: z.literal("text"), text: z.string() }),
                    ]),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: {
                        type: { type: String, enum: ["min", "text"] },
                        min: { type: Number, required: false },
                        text: { type: String, required: false },
                    },
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage records with nativeEnum keys", () => {
            enum Test {
                A = "a",
                B = "b",
            }
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    type: z.record(z.nativeEnum(Test), z.string()),
                }),
            );
            const expected: SchemaDefinition = {
                type: {
                    type: {
                        a: { type: String },
                        b: { type: String },
                    },
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage records with enum keys", () => {
            const test = ["a", "b"] as const;
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    type: z.record(z.enum(test), z.string()),
                }),
            );
            const expected: SchemaDefinition = {
                type: {
                    type: {
                        a: { type: String },
                        b: { type: String },
                    },
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage records with key wich are not enums", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    type: z.record(z.number(), z.string()),
                }),
            );
            const expected: SchemaDefinition = {
                type: {
                    type: {},
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage object deeper", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.object({ min: z.number(), max: z.number() }),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: {
                        min: { type: Number },
                        max: { type: Number },
                    },
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage discrimated union deeper in array", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.array(
                        z.discriminatedUnion("type", [
                            z.object({ type: z.literal("min"), min: z.number() }),
                            z.object({ type: z.literal("text"), text: z.string() }),
                        ]),
                    ),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: [
                        {
                            type: { type: String, enum: ["min", "text"] },
                            min: { type: Number, required: false },
                            text: { type: String, required: false },
                        },
                    ],
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage optional object", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.object({ min: z.number(), max: z.number() }).optional(),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    required: false,
                    type: {
                        min: { type: Number },
                        max: { type: Number },
                    },
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should not keep _id if subSchema has _id", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.object({ _id: z.string(), min: z.number() }),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: {
                        _id: { type: String },
                        min: { type: Number },
                    },
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage or objects", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.object({ min: z.number() }).or(z.object({ max: z.number() })),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: {
                        min: { type: Number, required: false },
                        max: { type: Number, required: false },
                    },
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage unions with _id inside, should not add _id", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.object({ _id: z.string() }).or(z.object({ max: z.number() })),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: {
                        max: { type: Number, required: false },
                        _id: { type: String, required: false },
                    },
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage unions with _id inside, should not add _id", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.object({ _id: z.string() }).or(z.object({ max: z.number() })),
                }),
                undefined,
                true,
            );
            const expected: SchemaDefinition = {
                params: {
                    type: {
                        max: { type: Number, required: false },
                    },
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage intersections", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.object({ min: z.number() }).and(z.object({ max: z.number() })),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: {
                        min: { type: Number },
                        max: { type: Number },
                    },
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage intersections with _id inside, should not add _id: false", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.object({ _id: z.string() }).and(z.object({ max: z.number() })),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: {
                        _id: { type: String },
                        max: { type: Number },
                    },
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage intersections with unions inside", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.object({ limit: z.number() }).and(z.union([z.object({ max: z.number() }), z.object({ min: z.number() })])),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: {
                        limit: { type: Number },
                        min: { type: Number, required: false },
                        max: { type: Number, required: false },
                    },
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage intersections with .or inside", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.object({ limit: z.number() }).and(z.object({ max: z.number() }).or(z.object({ min: z.number() }))),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: {
                        limit: { type: Number },
                        min: { type: Number, required: false },
                        max: { type: Number, required: false },
                    },
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage intersections with discriminated union inside", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z
                        .object({ limit: z.number() })
                        .and(
                            z.discriminatedUnion("type", [
                                z.object({ type: z.literal("t1"), max: z.number() }),
                                z.object({ type: z.literal("t2"), min: z.number() }),
                            ]),
                        ),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: {
                        limit: { type: Number },
                        type: { type: String, enum: ["t1", "t2"] },
                        min: { type: Number, required: false },
                        max: { type: Number, required: false },
                    },
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage intersections at the root of the schema", () => {
            const schema = generateMongooseSchemaFromZod(z.object({ limit: z.number() }).and(z.object({ max: z.number() })));
            const expected: SchemaDefinition = {
                limit: { type: Number },
                max: { type: Number },
            };
            expect(schema).toEqual(expected);
        });
    });

    describe("options", () => {
        it("should manage the optional field", () => {
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.string().optional() }));
            const expected: SchemaDefinition = {
                name: { required: false, type: String },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage the default option", () => {
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.string().default("test") }));
            const expected: SchemaDefinition = {
                name: { type: String, default: "test" },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage the min/max options for string", () => {
            const min = 0;
            const max = 20;
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.string().min(min).max(max) }));
            const expected: SchemaDefinition = {
                name: { type: String, min, max },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage min/max options on numbers", () => {
            const min = 0;
            const max = 20;
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.number().min(min).max(max) }));
            const expected: SchemaDefinition = {
                name: { type: Number, min, max },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage deeper optional", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.object({ min: z.number().optional(), max: z.number() }),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: {
                        min: { type: Number, required: false },
                        max: { type: Number },
                    },
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage refine methods", () => {
            const isValidObjectIdZod: [(val: string) => boolean, (val: string) => { message: string }] = [
                (val: string): boolean => Types.ObjectId.isValid(val),
                (val: string): { message: string } => ({ message: `${val} is not a valid mongoId` }),
            ];

            const schema = generateMongooseSchemaFromZod(
                z.object({
                    id: z.string().refine(...isValidObjectIdZod),
                }),
            );
            const expected: SchemaDefinition = {
                id: {
                    type: String,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage nullable", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    name: z.string().nullable(),
                }),
            );
            const expected: SchemaDefinition = {
                name: {
                    required: false,
                    type: String,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage ref to another entity", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    user: z.string({ description: "User" }),
                }),
            );
            const expected: SchemaDefinition = {
                user: {
                    type: Types.ObjectId,
                    ref: "User",
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage deeper or/union with simple types by using Mongoose Mixed", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.string().or(z.number()),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: Schema.Types.Mixed,
                },
            };
            expect(schema).toEqual(expected);
        });
    });

    describe("default schema", () => {
        it("should add default schema fields at root", () => {
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.string() }), {
                age: {
                    type: Number,
                },
            });
            const expected: SchemaDefinition = {
                name: { type: String },
                age: { type: Number },
            };
            expect(schema).toEqual(expected);
        });

        it("should update schema fields at root", () => {
            const schema = generateMongooseSchemaFromZod(z.object({ name: z.string() }), {
                name: {
                    type: String,
                    required: false,
                },
            });
            const expected: SchemaDefinition = {
                name: { required: false, type: String },
            };
            expect(schema).toEqual(expected);
        });

        it("should add default schema fields deeper", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    name: z.string(),
                    birthday: z.object({
                        day: z.number(),
                    }),
                }),
                {
                    birthday: {
                        type: {
                            month: {
                                type: Number,
                            },
                        },
                    },
                },
            );
            const expected: SchemaDefinition = {
                name: { type: String },
                birthday: {
                    type: {
                        day: { type: Number },
                        month: { type: Number },
                    },
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should update default schema fields deeper", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    name: z.string(),
                    birthday: z.object({
                        day: z.number(),
                    }),
                }),
                {
                    birthday: {
                        type: {
                            day: {
                                type: String,
                            },
                        },
                    },
                },
            );
            const expected: SchemaDefinition = {
                name: { type: String },
                birthday: {
                    type: {
                        day: { type: String },
                    },
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should manage union and merge deep sub objects", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.union([z.object({ sub: z.object({ min: z.number() }) }), z.object({ sub: z.object({ max: z.number() }) })]),
                }),
            );
            const expected: SchemaDefinition = {
                params: {
                    type: {
                        sub: {
                            required: false,
                            type: {
                                min: { type: Number, required: false },
                                max: { type: Number, required: false },
                            },
                            _id: false,
                        },
                    },
                    _id: false,
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should add custom typedKey", () => {
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    params: z.union([z.object({ sub: z.object({ min: z.number() }) }), z.object({ sub: z.object({ max: z.number() }) })]),
                }),
                undefined,
                undefined,
                { typedKey: "$type" },
            );

            const expected: SchemaDefinition = {
                params: {
                    $type: {
                        sub: {
                            required: false,
                            $type: {
                                min: { $type: Number, required: false },
                                max: { $type: Number, required: false },
                            },
                            _id: false,
                        },
                    },
                    _id: false,
                },
            };

            expect(schema).toEqual(expected);
        });
    });

    describe("errors", () => {
        it("should throw an error if type is not implemented", () => {
            expect(() => {
                generateMongooseSchemaFromZod(z.object({ name: z.unknown() }));
            }).toThrowError("Type ZodUnknown not supported");
        });

        it("should throw if there is an union/or at the root with mixed types", () => {
            expect(() => {
                generateMongooseSchemaFromZod(z.string().or(z.number()));
            }).toThrowError(UNION_WITH_NOT_OBJECT_AT_ROOT_ERROR);
        });
    });

    describe("errors", () => {
        it("should throw an error if _id exists at zod root", () => {
            expect(() =>
                generateMongooseSchemaFromZod(
                    z.object({
                        name: z.string(),
                        _id: z.string(),
                    }),
                ),
            ).toThrowError(new Error(ID_AT_ROOT_ERROR));
        });

        it("should throw an error if _id exists at default root", () => {
            expect(() =>
                generateMongooseSchemaFromZod(
                    z.object({
                        name: z.string(),
                    }),
                    {
                        _id: { type: String, required: true },
                    },
                ),
            ).toThrowError(new Error(ID_AT_ROOT_ERROR));
        });

        it("should throw an error if _id exists in union object root", () => {
            expect(() =>
                generateMongooseSchemaFromZod(
                    z.union([
                        z.object({
                            name: z.string(),
                            _id: z.string(),
                        }),
                        z.object({
                            name: z.string(),
                        }),
                    ]),
                ),
            ).toThrowError(new Error(ID_AT_ROOT_ERROR));
        });

        it("should handle zod.any", () => {
            expect(() =>
                generateMongooseSchemaFromZod(
                    z.object({
                        name: z.string(),
                        array: z.array(z.any()),
                    }),
                ),
            ).not.toThrowError();
            const schema = generateMongooseSchemaFromZod(
                z.object({
                    name: z.string(),
                    array: z.array(z.any()),
                }),
            );
            const expected: SchemaDefinition = {
                name: { type: String },
                array: {
                    type: [{ type: Schema.Types.Mixed }],
                },
            };
            expect(schema).toEqual(expected);
        });

        it("should throw an error if _id exists in discriminated union object root", () => {
            expect(() =>
                generateMongooseSchemaFromZod(
                    z.discriminatedUnion("type", [
                        z.object({
                            type: z.literal("name"),
                            name: z.string(),
                            _id: z.string(),
                        }),
                        z.object({
                            type: z.literal("age"),
                            name: z.string(),
                        }),
                    ]),
                ),
            ).toThrowError(new Error(ID_AT_ROOT_ERROR));
        });

        it("should not throw an error if _id exists at 1st degree", () => {
            expect(() =>
                generateMongooseSchemaFromZod(
                    z.object({
                        name: z.string(),
                        coucou: z.object({
                            _id: z.string(),
                        }),
                    }),
                ),
            ).not.toThrowError(new Error(ID_AT_ROOT_ERROR));
        });
    });
});
