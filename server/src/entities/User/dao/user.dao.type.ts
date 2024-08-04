import { CustomResponse } from "@/utils/CustomResponse.js";
import { User, UserData, UserWithoutPassword } from "../user.entity.js";

export type UserDAO = {
  getUser: (
    params: { userId: string } | { email: string }
  ) => Promise<UserWithoutPassword | null>;
  setIsCertified: (params: {
    userId: string;
    isCertified: boolean;
  }) => Promise<UserWithoutPassword | null>;
  createUser: (params: {
    userData: UserData;
  }) => Promise<CustomResponse<UserWithoutPassword, "duplicate_email">>;
  getUserWithPassword: (
    params: { email: string } | { userId: string }
  ) => Promise<User | null>;
  upToDateLastLogin: (params: { userId: string }) => Promise<UserWithoutPassword | null>;
  setResetPasswordToken: (params: {
    email: string;
    token: string;
    expires: Date;
  }) => Promise<UserWithoutPassword | null>;
  updateUserPassword: (
    params:
      | {
          resetPasswordToken: string;
          newHashedPassword: string;
        }
      | { userId: string; newHashedPassword: string }
  ) => Promise<UserWithoutPassword | null>;
  validateEmail: (params: { userId: string }) => Promise<UserWithoutPassword | null>;
  updateUser: (params: {
    userId: string;
    updates: {
      name?: string;
      testerMessage?: string;
      sellerMessage?: string;
      paypalEmail?: string;
      amazonId?: string;
    };
  }) => Promise<
    CustomResponse<UserWithoutPassword, "name_already_used" | "user_not_found">
  >;
};
