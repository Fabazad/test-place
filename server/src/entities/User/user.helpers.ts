import { UserWithoutPassword } from "./user.entity.js";

export type SignedInUser = {
  user: UserWithoutPassword;
  token: string;
  requestedTestsCount: number;
  processingTestsCount: number;
  completedTestsCount: number;
  cancelledTestsCount: number;
  guiltyTestsCount: number;
};
