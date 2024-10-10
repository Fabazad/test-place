
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="98ac404e-0afa-59cd-a6a1-1e2c37dafae8")}catch(e){}}();
import { Role } from "../../../utils/constants.js";
import { generateMongooseSchemaFromZod } from "../../../utils/generateMongooseSchemaFromZod/index.js";
import { createSingletonGetter } from "../../../utils/singleton.js";
import mongoose from "mongoose";
import { userDataSchema } from "../user.entity.js";
const userSchema = new mongoose.Schema(generateMongooseSchemaFromZod(userDataSchema));
userSchema
    .index({ email: 1 }, { unique: true })
    .index({ name: 1 }, { unique: true })
    .index({ googleId: 1 }, { unique: true, sparse: true })
    .index({ facebookId: 1 }, { unique: true, sparse: true })
    .index({ amazonId: 1 }, { unique: true, sparse: true });
const userModel = mongoose.model("User", userSchema);
const createUserDAO = () => {
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
            if (!user)
                return null;
            const { password, ...userWithoutPassword } = user;
            return JSON.parse(JSON.stringify(userWithoutPassword));
        },
        setIsCertified: async ({ userId, isCertified }) => {
            const user = await userModel
                .findByIdAndUpdate(userId, { $set: { isCertified } }, { new: true })
                .lean();
            if (!user)
                return null;
            const { password, ...userWithoutPassword } = user;
            return JSON.parse(JSON.stringify(userWithoutPassword));
        },
        createUser: async ({ userData }) => {
            try {
                const user = await userModel.create(userData);
                const { password, ...userWithoutPassword } = user.toJSON();
                return { success: true, data: JSON.parse(JSON.stringify(userWithoutPassword)) };
            }
            catch (err) {
                if (err.code === 11000) {
                    if (err.keyPattern.email) {
                        return { success: false, errorCode: "duplicate_email" };
                    }
                    else if (err.keyPattern.name) {
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
            if (!user)
                return null;
            const { password, ...userWithoutPassword } = user;
            return JSON.parse(JSON.stringify(userWithoutPassword));
        },
        setResetPasswordToken: async ({ email, token, expires }) => {
            const user = await userModel
                .findOneAndUpdate({ email }, { $set: { resetPasswordToken: token, resetPasswordExpires: expires } }, { new: true })
                .lean();
            if (!user)
                return null;
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
            if (!user)
                return null;
            return JSON.parse(JSON.stringify(user));
        },
        updateUserPassword: async (params) => {
            const user = await userModel
                .findOneAndUpdate({
                ...("resetPasswordToken" in params && {
                    resetPasswordToken: params.resetPasswordToken,
                    resetPasswordExpires: { $gte: new Date() },
                }),
                ...("userId" in params && {
                    _id: params.userId,
                }),
            }, {
                $set: { password: params.newHashedPassword },
                ...("resetPasswordToken" in params && {
                    $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
                }),
            }, { new: true, projection: { password: 0 } })
                .lean();
            if (!user)
                return null;
            return JSON.parse(JSON.stringify(user));
        },
        validateEmail: async ({ userId }) => {
            const user = await userModel
                .findByIdAndUpdate(userId, { $set: { emailValidation: true } }, { new: true, projection: { password: 0 } })
                .lean();
            if (!user)
                return null;
            return JSON.parse(JSON.stringify(user));
        },
        updateUser: async ({ userId, updates }) => {
            try {
                const userToUpdate = await userModel
                    .findByIdAndUpdate(userId, { $set: updates }, { new: true, projection: { password: 0 } })
                    .lean();
                if (!userToUpdate)
                    return { success: false, errorCode: "user_not_found" };
                const user = JSON.parse(JSON.stringify(userToUpdate));
                return { success: true, data: user };
            }
            catch (err) {
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
                .findByIdAndUpdate(userId, { $set: updates }, { new: true, projection: { password: 0 } })
                .lean();
            if (!userToUpdate)
                return null;
            return JSON.parse(JSON.stringify(userToUpdate));
        },
        getTestersContacts: async () => {
            const testers = await userModel
                .find({ roles: { $in: [Role.TESTER] } }, { email: 1, name: 1, language: 1 })
                .lean();
            console.log({ testers });
            return testers;
        },
    };
};
export const getUserDAO = createSingletonGetter(createUserDAO);
//# sourceMappingURL=user.dao.index.js.map
//# debugId=98ac404e-0afa-59cd-a6a1-1e2c37dafae8
