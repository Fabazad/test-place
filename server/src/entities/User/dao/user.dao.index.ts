import { configs } from "@/configs.js";
import { Role } from "@/utils/constants.js";
import { generateMongooseSchemaFromZod } from "@/utils/generateMongooseSchemaFromZod/index.js";
import { Language } from "@/utils/Language.js";
import { omittedSavedDataSchema } from "@/utils/savedDataSchema.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import dayjs from "dayjs";
import mongoose, { Types } from "mongoose";
import { User, userSchema } from "../user.entity.js";
import { UserDAO } from "./user.dao.type.js";

const mongooseUserSchema = new mongoose.Schema<User>(
  generateMongooseSchemaFromZod(userSchema.omit(omittedSavedDataSchema)),
  { timestamps: true }
);

mongooseUserSchema
  .index({ email: 1 }, { unique: true })
  .index({ name: 1 }, { unique: true })
  .index({ googleId: 1 }, { unique: true, sparse: true })
  .index({ facebookId: 1 }, { unique: true, sparse: true })
  .index({ amazonId: 1 }, { unique: true, sparse: true })
  .index({ "affiliated.by": 1 });

const userModel = mongoose.model<User>("User", mongooseUserSchema);

const createUserDAO = (): UserDAO => {
  const checkAffiliated = async (
    affiliatedBy?: string
  ): Promise<{ by: string; rateInPercent: number } | undefined> => {
    if (!affiliatedBy) return undefined;
    if (!Types.ObjectId.isValid(affiliatedBy)) return undefined;
    const affiliatedByUser = await userModel.findOne({ _id: affiliatedBy });
    if (!affiliatedByUser) return undefined;

    return {
      by: affiliatedByUser._id,
      rateInPercent:
        affiliatedByUser.personalAffiliationRateInPercent ||
        configs.AFFILIATION_RATE_IN_PERCENT,
    };
  };

  return {
    getUser: async (params) => {
      const user = await userModel
        .findOne({
          ...("email" in params && { email: params.email }),
          ...("userId" in params && { _id: params.userId }),
          ...("googleId" in params && {
            $or: [{ googleId: params.googleId }, { email: params.email }],
          }),
          ...("facebookId" in params && { facebookId: params.facebookId }),
        })
        .lean();
      if (!user) return null;
      const { password, ...userWithoutPassword } = user;
      return JSON.parse(JSON.stringify(userWithoutPassword));
    },
    setIsCertified: async ({ userId, isCertified }) => {
      const user = await userModel
        .findByIdAndUpdate(userId, { $set: { isCertified } }, { new: true })
        .lean();
      if (!user) return null;
      const { password, ...userWithoutPassword } = user;
      return JSON.parse(JSON.stringify(userWithoutPassword));
    },
    createUser: async ({ userData }) => {
      try {
        const affiliated = await checkAffiliated(userData.affiliatedBy);
        const user = await userModel.create({ ...userData, affiliated });
        const { password, ...userWithoutPassword } = user.toJSON();
        return { success: true, data: JSON.parse(JSON.stringify(userWithoutPassword)) };
      } catch (err: any) {
        if (err.code === 11000) {
          if (err.keyPattern.email) {
            return { success: false, errorCode: "duplicate_email" };
          } else if (err.keyPattern.name) {
            return { success: false, errorCode: "duplicate_name" };
          }
        }
        throw err;
      }
    },
    upToDateLastLogin: async ({ userId }) => {
      const user = await userModel
        .findByIdAndUpdate(userId, { $set: { lastLogin: new Date() } }, { new: true })
        .lean();
      if (!user) return null;
      const { password, ...userWithoutPassword } = user;
      return JSON.parse(JSON.stringify(userWithoutPassword));
    },
    setResetPasswordToken: async ({ email, token, expires }) => {
      const user = await userModel
        .findOneAndUpdate(
          { email },
          { $set: { resetPasswordToken: token, resetPasswordExpires: expires } },
          { new: true }
        )
        .lean();
      if (!user) return null;
      const { password, ...userWithoutPassword } = user;
      return JSON.parse(JSON.stringify(userWithoutPassword));
    },
    getUserWithPassword: async (params) => {
      const user = await userModel
        .findOne({
          ...("email" in params && { email: params.email }),
          ...("userId" in params && { _id: params.userId }),
        })
        .lean();
      if (!user) return null;
      return JSON.parse(JSON.stringify(user));
    },
    updateUserPassword: async (params) => {
      const user = await userModel
        .findOneAndUpdate(
          {
            ...("resetPasswordToken" in params && {
              resetPasswordToken: params.resetPasswordToken,
              resetPasswordExpires: { $gte: new Date() },
            }),
            ...("userId" in params && {
              _id: params.userId,
            }),
          },
          {
            $set: { password: params.newHashedPassword },
            ...("resetPasswordToken" in params && {
              $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
            }),
          },
          { new: true, projection: { password: 0 } }
        )
        .lean();

      if (!user) return null;
      return JSON.parse(JSON.stringify(user));
    },
    validateEmail: async ({ userId }) => {
      const user = await userModel
        .findByIdAndUpdate(
          userId,
          { $set: { emailValidation: true } },
          { new: true, projection: { password: 0 } }
        )
        .lean();
      if (!user) return null;
      return JSON.parse(JSON.stringify(user));
    },
    updateUser: async ({ userId, updates }) => {
      try {
        const userToUpdate = await userModel
          .findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, projection: { password: 0 } }
          )
          .lean();
        if (!userToUpdate) return { success: false, errorCode: "user_not_found" };
        const user = JSON.parse(JSON.stringify(userToUpdate));
        return { success: true, data: user };
      } catch (err: any) {
        if (err.code === 11000) {
          if (err.keyPattern.name) {
            return { success: false, errorCode: "name_already_used" };
          }
        }
        throw err;
      }
    },
    updateUserWIthNoUniqueField: async ({ userId, updates }) => {
      const userToUpdate = await userModel
        .findByIdAndUpdate(
          userId,
          { $set: updates },
          { new: true, projection: { password: 0 } }
        )
        .lean<Omit<User, "password">>();
      if (!userToUpdate) return null;
      return JSON.parse(JSON.stringify(userToUpdate));
    },
    getTestersContacts: async () => {
      const testers = await userModel
        .find({ roles: { $in: [Role.TESTER] } }, { email: 1, name: 1, language: 1 })
        .lean<Array<{ email: string; name: string; language: Language }>>();
      return testers;
    },
    getUserAffiliated: async ({ userId, page, limit }) => {
      const [affiliatedUsers, totalCount] = await Promise.all([
        userModel
          .find(
            { "affiliated.by": userId },
            { _id: 1, name: 1, email: 1, "affiliated.rateInPercent": 1, createdAt: 1 }
          )
          .sort({ _id: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean<
            Array<{
              _id: string;
              name: string;
              email: string;
              affiliated: { rateInPercent: number };
              createdAt: string;
            }>
          >(),
        userModel.find({ "affiliated.by": userId }).countDocuments(),
      ]);

      const affiliated = affiliatedUsers.map((user) => ({
        userId: user._id,
        name: user.name,
        email: user.email,
        rateInPercent: user.affiliated.rateInPercent,
        createdAt:
          user.createdAt ||
          dayjs(new Types.ObjectId(user._id).getTimestamp()).toISOString(),
      }));
      return { affiliated, totalCount };
    },
    getUserAffiliatedCount: async ({ userId }) => {
      const totalCount = await userModel
        .find({ "affiliated.by": userId })
        .countDocuments();

      return totalCount;
    },
  };
};

export const getUserDAO = createSingletonGetter(createUserDAO);
