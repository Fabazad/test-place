import { TestStatusUpdateParams } from "@/utils/constants.js";
import { CustomResponse } from "@/utils/CustomResponse.js";
import { TestStatus } from "../test.constants.js";
import { PopulatedTest, Test, TestData } from "../test.entity.js";

export type TestDAO = {
  createTest: (params: {
    testData: TestData;
  }) => Promise<CustomResponse<Test, "already_testing" | "previous_request_declined">>;
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
  findManyByUser: (params: {
    userId: string;
    status?: Array<TestStatus>;
  }) => Promise<Array<Test>>;
  findPendingTests: (
    params: { pendingDays: number } | { minPendingDays: number }
  ) => Promise<Array<Test>>;
  cancelTests: (params: {
    testsCancellations: Array<{ testId: string; guiltyUserId: string }>;
    adminMessage?: string;
  }) => Promise<void>;
};
