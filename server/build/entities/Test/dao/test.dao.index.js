
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0dc8e178-e5e8-52bb-8890-10cbd7c03f37")}catch(e){}}();
import { generateAmazonUrl } from "../../Product/product.constants.js";
import { generateMongooseSchemaFromZod } from "../../../utils/generateMongooseSchemaFromZod/index.js";
import { createSingletonGetter } from "../../../utils/singleton.js";
import mongoose from "mongoose";
import { GLOBAL_TEST_STATUSES, TestStatus } from "../test.constants.js";
import { testDataSchema } from "../test.entity.js";
const testMongooseSchema = new mongoose.Schema(generateMongooseSchemaFromZod(testDataSchema), { timestamps: true });
testMongooseSchema.pre("save", async function (next) {
    // Check if document is new or a new status has been set
    if (this.isNew || this.isModified("status")) {
        const document = this;
        if (!("updates" in document))
            throw new Error("updates is missing");
        if (!(document.updates instanceof Array))
            throw new Error("updates is not an array");
        if (!("status" in document))
            throw new Error("status is missing");
        document.updates.push({ date: new Date(), status: document.status });
    }
    next();
});
testMongooseSchema.index({
    "product._id": 1,
    tester: 1,
});
const testModel = mongoose.model("Test", testMongooseSchema);
export const createTestDAO = () => {
    const buildConditions = (statuses, seller, tester) => {
        return {
            ...(seller ? { seller } : {}),
            ...(tester ? { tester } : {}),
            ...(statuses ? { status: { $in: statuses } } : {}),
        };
    };
    const formatOneTest = (test) => {
        test.product.amazonUrl = generateAmazonUrl(test.product);
        // @ts-ignore
        if (typeof test.seller === "object")
            delete test.seller.password;
        // @ts-ignore
        if (typeof test.tester === "object")
            delete test.tester.password;
        return test;
    };
    const formatResults = (test) => {
        if (Array.isArray(test)) {
            return JSON.parse(JSON.stringify(test.map((t) => formatOneTest(t))));
        }
        return JSON.parse(JSON.stringify(formatOneTest(test)));
    };
    return {
        createTest: async ({ testData }) => {
            const alreadyTesting = await testModel.findOne({
                "product._id": testData.product._id,
                tester: testData.tester,
                status: {
                    $in: [...GLOBAL_TEST_STATUSES.REQUESTED, ...GLOBAL_TEST_STATUSES.PROCESSING],
                },
            }, { status: 1 });
            if (alreadyTesting) {
                if (alreadyTesting.status === TestStatus.REQUEST_DECLINED) {
                    return { success: false, errorCode: "previous_request_declined" };
                }
                return { success: false, errorCode: "already_testing" };
            }
            const res = await testModel.create(testData);
            const test = formatResults(res.toJSON());
            return { success: true, data: test };
        },
        findWIthAllPopulated: async ({ statuses, seller, tester, skip, limit }) => {
            const res = await testModel
                .find({
                $or: [
                    { expirationDate: { $gt: new Date() } },
                    { expirationDate: { $eq: null } },
                ],
                ...buildConditions(statuses, seller, tester),
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate(["seller", "tester"])
                .lean();
            return JSON.parse(JSON.stringify(res.map((test) => {
                test.product.amazonUrl = generateAmazonUrl(test.product);
                // @ts-ignore
                delete test.tester.password;
                // @ts-ignore
                delete test.seller.password;
                return test;
            })));
        },
        count: async ({ statuses, seller, tester }) => {
            const res = await testModel.countDocuments({
                $or: [{ expirationDate: { $gt: new Date() } }, { expirationDate: { $eq: null } }],
                ...buildConditions(statuses, seller, tester),
            });
            return res;
        },
        findById: async ({ id }) => {
            const res = await testModel.findById(id).lean();
            if (!res)
                return null;
            res.product.amazonUrl = generateAmazonUrl(res.product);
            return JSON.parse(JSON.stringify(res));
        },
        updateTestStatus: async ({ id, statusUpdate, cancellationGuilty }) => {
            const test = await testModel
                .findOneAndUpdate({
                _id: id,
            }, {
                $set: {
                    ...(cancellationGuilty ? { cancellationGuilty } : {}),
                    status: statusUpdate.status,
                    ...("params" in statusUpdate ? { ...statusUpdate.params } : {}),
                    expirationDate: null,
                    ...(statusUpdate.status === TestStatus.TEST_CANCELLED
                        ? { $inc: { remainingTestsCount: 1 } }
                        : {}),
                },
            }, {
                new: true,
            })
                .lean();
            if (!test)
                return null;
            test.product.amazonUrl = generateAmazonUrl(test.product);
            return JSON.parse(JSON.stringify(test));
        },
        findPopulatedById: async ({ id }) => {
            const test = await testModel
                .findById(id)
                .populate(["seller", "tester"])
                .lean();
            if (!test)
                return null;
            test.product.amazonUrl = generateAmazonUrl(test.product);
            // @ts-ignore
            delete test.tester.password;
            // @ts-ignore
            delete test.seller.password;
            test.product.amazonUrl = generateAmazonUrl(test.product);
            return JSON.parse(JSON.stringify(test));
        },
        countTestWithStatues: async ({ userId, statuses, withGuilty = false }) => {
            const query = {
                $and: [
                    { $or: [{ seller: userId }, { tester: userId }] },
                    {
                        $or: [
                            {
                                expirationDate: { $gt: new Date() },
                            },
                            {
                                expirationDate: { $eq: null },
                            },
                        ],
                    },
                ],
                status: { $in: statuses },
            };
            if (withGuilty) {
                query.$and?.push({
                    $or: [
                        { cancellationGuilty: userId },
                        { cancellationGuilty: { $exists: false } },
                    ],
                });
            }
            return testModel.countDocuments(query);
        },
        findManyByUser: async ({ userId, status }) => {
            const tests = await testModel
                .find({
                tester: userId,
                ...(status && { status: { $in: status } }),
            })
                .lean();
            return tests;
        },
    };
};
export const getTestDAO = createSingletonGetter(createTestDAO);
//# sourceMappingURL=test.dao.index.js.map
//# debugId=0dc8e178-e5e8-52bb-8890-10cbd7c03f37
