import { configs } from "@/configs";
import { generateMongooseSchemaFromZod } from "@/utils/generateMongooseSchemaFromZod";
import { createSingletonGetter } from "@/utils/singleton";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User, UserData, userDataSchema } from "../user.entity";
import { UserDAO } from "./user.dao.type";

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

  UserSchema.methods.isCorrectPassword = function (password, callback) {
    if (!this.password) return callback(new Error("no_password_registered"));
    bcrypt.compare(password, this.password, function (err, same) {
      if (err) {
        callback(err);
      } else {
        callback(err, same);
      }
    });
  };

  UserSchema.methods.toJSON = function () {
    var obj = this.toObject();
    // @ts-ignore
    delete obj.password;
    return obj;
  };

  const userModel = mongoose.model<UserData>("User", UserSchema);
  return {
    getUser: async ({ userId }) => {
      const user = await userModel.findById(userId);
      if (!user) return null;
      return JSON.parse(JSON.stringify(user));
    },
    setIsCertified: async ({ userId, isCertified }) => {
      await userModel.findByIdAndUpdate(userId, { $set: { isCertified } });
    },
  };
};

export const getUserDAO = createSingletonGetter(createUserDAO);
