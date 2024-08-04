import { TestStatus } from "@/utils/constants.js";
import { generateMongooseSchemaFromZod } from "@/utils/generateMongooseSchemaFromZod/index.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import mongoose, { FilterQuery } from "mongoose";
import { Test, TestData, testDataSchema } from "../test.entity.js";
import { TestDAO } from "./test.dao.type.js";

export const createTestDAO = (): TestDAO => {
  const testMongooseSchema = new mongoose.Schema(
    generateMongooseSchemaFromZod(testDataSchema),
    { timestamps: true }
  );

  testMongooseSchema.pre("save", async function (next) {
    // Check if document is new or a new status has been set
    if (this.isNew || this.isModified("status")) {
      const document = this;
      if (!("updates" in document)) throw new Error("updates is missing");
      if (!(document.updates instanceof Array))
        throw new Error("updates is not an array");
      if (!("status" in document)) throw new Error("status is missing");
      document.updates.push({ date: new Date(), status: document.status });
    }
    next();
  });

  testMongooseSchema.index(
    {
      product: 1,
      tester: 1,
    },
    {
      unique: true,
    }
  );

  const testModel = mongoose.model<TestData>("Test", testMongooseSchema);

  const buildConditions = (
    statuses?: Array<TestStatus>,
    seller?: string,
    tester?: string
  ) => {
    return {
      ...(seller ? { seller } : {}),
      ...(tester ? { tester } : {}),
      ...(statuses ? { status: { $in: statuses } } : {}),
    };
  };

  return {
    createTest: async ({ testData }) => {
      const res = await testModel.create(testData);
      return JSON.parse(JSON.stringify(res));
    },
    findWIthAllPopulated: async ({ statuses, seller, tester, skip, limit }) => {
      const res = await testModel
        .find(
          {
            $or: [
              { expirationDate: { $gt: new Date() } },
              { expirationDate: { $eq: null } },
            ],
            ...buildConditions(statuses, seller, tester),
          },
          {}
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(["seller", "tester"]);
      return JSON.parse(JSON.stringify(res));
    },
    count: async ({ statuses, seller, tester }) => {
      const res = await testModel.count({
        $or: [{ expirationDate: { $gt: new Date() } }, { expirationDate: { $eq: null } }],
        ...buildConditions(statuses, seller, tester),
      });
      return res;
    },
    findById: async ({ id }) => {
      const res = await testModel.findById(id);
      if (!res) return null;
      return JSON.parse(JSON.stringify(res));
    },
    updateTestStatus: async ({ id, statusUpdate, cancellationGuilty }) => {
      const tets = await testModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            ...(cancellationGuilty ? { cancellationGuilty } : {}),
            status: statusUpdate.status,
            ...("params" in statusUpdate ? { ...statusUpdate.params } : {}),
            expirationDate: null,
            ...(statusUpdate.status === TestStatus.TEST_CANCELLED
              ? { $inc: { remainingTestsCount: 1 } }
              : {}),
          },
        }
      );

      if (!tets) return null;

      return JSON.parse(JSON.stringify(tets));
    },
    findPopulatedById: async ({ id }) => {
      const test = await testModel.findById(id).populate(["seller", "tester"]);
      if (!test) return null;
      return JSON.parse(JSON.stringify(test));
    },
    countTestWithStatues: async ({ userId, statuses, withGuilty = false }) => {
      const query: FilterQuery<Test> = {
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
  };
};

export const getTestDAO = createSingletonGetter(createTestDAO);
