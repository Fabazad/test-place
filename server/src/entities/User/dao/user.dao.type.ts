import { CustomResponse } from "@/utils/CustomResponse.js";
import { User, UserData, UserWithoutPassword } from "../user.entity.js";

export type UserDAO = {
  getUser: (params: { userId: string }) => Promise<UserWithoutPassword | null>;
  setIsCertified: (params: {
    userId: string;
    isCertified: boolean;
  }) => Promise<UserWithoutPassword | null>;
  createUser: (params: {
    userData: UserData;
  }) => Promise<CustomResponse<UserWithoutPassword, "duplicate_email">>;
  getUserWithPassword: (params: { email: string }) => Promise<User | null>;
  upToDateLastLogin: (params: { userId: string }) => Promise<UserWithoutPassword | null>;
  setResetPasswordToken: (params: {
    email: string;
    token: string;
    expires: Date;
  }) => Promise<UserWithoutPassword | null>;
};
