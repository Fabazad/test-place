import { TestStatus, TestStatusUpdateParams } from "@/utils/constants.js";
import { PopulatedTest, Test, TestData } from "../test.entity.js";

export type TestDAO = {
  createTest: (params: { testData: TestData }) => Promise<Test>;
  findWIthAllPopulated: (params: {
    statuses?: Array<TestStatus>;
    seller?: string;
    tester?: string;
    skip: number;
    limit: number;
  }) => Promise<Array<PopulatedTest>>;
  count: (params: {
    statuses?: Array<TestStatus>;
    seller?: string;
    tester?: string;
  }) => Promise<number>;
  findById: (params: { id: string }) => Promise<Test | null>;
  updateTestStatus: (params: {
    id: string;
    statusUpdate: TestStatusUpdateParams;
    cancellationGuilty?: string;
  }) => Promise<Test | null>;
  findPopulatedById: (params: { id: string }) => Promise<PopulatedTest | null>;
  countTestWithStatues: (params: {
    userId: string;
    statuses: Array<TestStatus>;
    withGuilty?: boolean;
  }) => Promise<number>;
};
