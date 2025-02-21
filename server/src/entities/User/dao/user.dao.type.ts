import { Role } from "@/utils/constants.js";
import { CustomResponse } from "@/utils/CustomResponse.js";
import { Language } from "@/utils/Language.js";
import {
  ActivationEventType,
  User,
  UserData,
  UserWithoutPassword,
} from "../user.entity.js";

export type UserDAO = {
  getUser: (
    params:
      | { userId: string }
      | { email: string }
      | { googleId: string; email?: string }
      | { facebookId: string }
  ) => Promise<UserWithoutPassword | null>;
  setIsCertified: (params: {
    userId: string;
    isCertified: boolean;
  }) => Promise<UserWithoutPassword | null>;
  createUser: (params: {
    userData: UserData;
  }) => Promise<
    CustomResponse<UserWithoutPassword, "duplicate_email" | "duplicate_name">
  >;
  getUserWithPassword: (
    params: { email: string } | { userId: string }
  ) => Promise<User | null>;
  upToDateLastLogin: (params: {
    userId: string;
    ip?: string;
  }) => Promise<UserWithoutPassword | null>;
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
      googleId?: string;
      facebookId?: string;
    };
  }) => Promise<
    CustomResponse<
      UserWithoutPassword,
      "name_already_used" | "user_not_found" | "amazon_id_already_used"
    >
  >;
  updateUserWIthNoUniqueField: (params: {
    userId: string;
    updates: {
      testerMessage?: string;
      sellerMessage?: string;
      paypalEmail?: string;
      googleId?: string;
      facebookId?: string;
      language?: Language;
    };
  }) => Promise<UserWithoutPassword | null>;
  getTestersContacts: () => Promise<
    Array<{
      email: User["email"];
      name: User["name"];
      language: User["language"];
    }>
  >;
  getUserAffiliated: (params: {
    userId: string;
    page: number;
    limit: number;
    search?: string;
  }) => Promise<{
    affiliated: Array<{
      userId: string;
      name: string;
      email: string;
      rateInPercent: number;
      createdAt: string;
      activationEvents: User["activationEvents"];
    }>;
    totalCount: number;
  }>;
  getUserAffiliatedCount: (params: { userId: string }) => Promise<number>;
  addActivationEvents: (params: {
    userId: string;
    eventTypes: Array<ActivationEventType>;
  }) => Promise<void>;
  getUserIds: (params: { role: Role }) => Promise<Array<string>>;
  getUsers: () => Promise<Array<{ _id: string; name: string }>>;
};
