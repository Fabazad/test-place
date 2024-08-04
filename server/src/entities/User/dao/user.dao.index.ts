import { configs } from "@/configs.js";
import { generateMongooseSchemaFromZod } from "@/utils/generateMongooseSchemaFromZod/index.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User, userDataSchema } from "../user.entity.js";
import { UserDAO } from "./user.dao.type.js";

const createUserDAO = (): UserDAO => {
  const UserSchema = new mongoose.Schema<User>(
    generateMongooseSchemaFromZod(userDataSchema)
  );

  UserSchema.pre("save", function (next) {
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified("password")) {
      // Saving reference to this because of changing scopes
      const document = this;
      if (document.password === null) return next();
      bcrypt.hash(document.password, configs.SALT_ROUNDS, function (err, hashedPassword) {
        if (err) {
          next(err);
        } else {
          document.password = hashedPassword;
          next();
        }
      });
    } else {
      next();
    }
  });

  const userModel = mongoose.model<User>("User", UserSchema);

  return {
    getUser: async ({ userId }) => {
      const user = await userModel.findById(userId).lean();
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
  };
};

export const getUserDAO = createSingletonGetter(createUserDAO);
