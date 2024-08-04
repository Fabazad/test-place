import { generateMongooseSchemaFromZod } from "@/utils/generateMongooseSchemaFromZod/index.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import mongoose from "mongoose";
import { User, userDataSchema } from "../user.entity.js";
import { UserDAO } from "./user.dao.type.js";

const createUserDAO = (): UserDAO => {
  const userSchema = new mongoose.Schema<User>(
    generateMongooseSchemaFromZod(userDataSchema)
  );

  userSchema.index({ email: 1 }, { unique: true }).index({ name: 1 }, { unique: true });

  const userModel = mongoose.model<User>("User", userSchema);

  return {
    getUser: async (params) => {
      const user = await userModel
        .findOne({
          ...("email" in params && { email: params.email }),
          ...("userId" in params && { _id: params.userId }),
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
        const user = await userModel.create(userData);
        const { password, ...userWithoutPassword } = user;
        return { success: true, data: JSON.parse(JSON.stringify(userWithoutPassword)) };
      } catch (err: any) {
        if (err.code === 11000) {
          return { success: false, errorCode: "duplicate_email" };
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
          { new: true }
        )
        .lean();

      if (!user) return null;
      const { password, ...userWithoutPassword } = user;
      return JSON.parse(JSON.stringify(userWithoutPassword));
    },
    validateEmail: async ({ userId }) => {
      const user = await userModel
        .findByIdAndUpdate(userId, { $set: { emailValidation: true } }, { new: true })
        .lean();
      if (!user) return null;
      const { password, ...userWithoutPassword } = user;
      return JSON.parse(JSON.stringify(userWithoutPassword));
    },
  };
};

export const getUserDAO = createSingletonGetter(createUserDAO);
