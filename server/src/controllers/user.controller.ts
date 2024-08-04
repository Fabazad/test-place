import { configs } from "@/configs.js";
import { TestController } from "@/controllers/test.controller.js";
import { getTestDAO } from "@/entities/Test/dao/test.dao.index.js";
import { getUserDAO } from "@/entities/User/dao/user.dao.index.js";
import { User, UserWithoutPassword } from "@/entities/User/user.entity.js";
import { getAuthManager } from "@/libs/AuthManager/index.js";
import { getEmailClient } from "@/libs/EmailClient/index.js";
import { Role } from "@/utils/constants.js";
import { CustomResponse } from "@/utils/CustomResponse.js";
import { DecodedUser } from "@/utils/DecodedUser.type.js";
import { Language } from "@/utils/Language.js";
import axios from "axios";
import dayjs from "dayjs";

const EmailController = require("../controllers/email.controller");
const { ROLES, TEST_STATUSES, MAIL_TEMPLATES_IDS } = require("../helpers/constants");
const constants = require("../helpers/constants");

const { GLOBAL_TEST_STATUSES } = constants;
const FROM_MAIL_ADDRESS = configs.FROM_MAIL_ADDRESS;

export class UserController {
  static async credentialRegister(params: {
    roles: Array<Role>;
    name: string;
    email: string;
    password: string;
    language: Language;
  }): Promise<CustomResponse<UserWithoutPassword, "duplicate_email">> {
    const { roles, name, email, password, language } = params;

    const userDAO = getUserDAO();
    const authManager = getAuthManager();
    const emailClient = getEmailClient();

    const hashedPassword = authManager.hashPassword(password);
    const userRes = await userDAO.createUser({
      userData: {
        name,
        email,
        password: hashedPassword,
        roles,
        language,
        isCertified: false,
        emailValidation: false,
      },
    });

    if (!userRes.success) return userRes;
    const user = userRes.data;

    await emailClient.sendValidateMailAddressMail({ email, userId: user._id, language });

    return { success: true, data: user };
  }

  static async login(params: { user: User; staySignedIn: boolean }): Promise<
    CustomResponse<
      {
        user: UserWithoutPassword;
        token: string;
        requestedTestsCount: number;
        processingTestsCount: number;
        completedTestsCount: number;
        cancelledTestsCount: number;
        guiltyTestsCount: number;
      },
      "user_not_found_when_logging"
    >
  > {
    const { user, staySignedIn } = params;

    const authManager = getAuthManager();
    const userDAO = getUserDAO();
    const testDAO = getTestDAO();

    const token = authManager.encodeUser({
      decodedUser: {
        userId: user._id,
        roles: user.roles,
        amazonId: user.amazonId,
      },
      staySignedIn,
    });

    const [
      newUser,
      requestedTestsCount,
      processingTestsCount,
      completedTestsCount,
      cancelledTestsCount,
      guiltyTestsCount,
    ] = await Promise.all([
      userDAO.upToDateLastLogin({ userId: user._id }),
      testDAO.countTestWithStatues({
        userId: user._id,
        statuses: GLOBAL_TEST_STATUSES.REQUESTED,
      }),
      testDAO.countTestWithStatues({
        userId: user._id,
        statuses: GLOBAL_TEST_STATUSES.PROCESSING,
      }),
      testDAO.countTestWithStatues({
        userId: user._id,
        statuses: GLOBAL_TEST_STATUSES.COMPLETED,
      }),
      testDAO.countTestWithStatues({
        userId: user._id,
        statuses: GLOBAL_TEST_STATUSES.CANCELLED,
      }),
      testDAO.countTestWithStatues({
        userId: user._id,
        statuses: GLOBAL_TEST_STATUSES.CANCELLED,
        withGuilty: true,
      }),
    ]);

    if (!newUser) return { success: false, errorCode: "user_not_found_when_logging" };

    return {
      success: true,
      data: {
        user: newUser,
        token,
        requestedTestsCount,
        processingTestsCount,
        completedTestsCount,
        cancelledTestsCount,
        guiltyTestsCount,
      },
    };
  }

  static async credentialLogin(params: {
    email: string;
    password: string;
    staySignedIn: boolean;
  }): Promise<
    CustomResponse<
      {
        user: UserWithoutPassword;
        token: string;
        requestedTestsCount: number;
        processingTestsCount: number;
        completedTestsCount: number;
        cancelledTestsCount: number;
        guiltyTestsCount: number;
      },
      | "wrong_password"
      | "email_not_found"
      | "email_not_validated"
      | "missing_password"
      | "user_not_found_when_logging"
    >
  > {
    const { email, password, staySignedIn } = params;

    const userDAO = getUserDAO();
    const authManager = getAuthManager();

    const user = await userDAO.getUserWithPassword({ email });

    if (!user) return { success: false, errorCode: "email_not_found" };

    if (!user.emailValidation)
      return { success: false, errorCode: "email_not_validated" };

    if (!user.password) return { success: false, errorCode: "missing_password" };

    if (!authManager.comparePasswords(password, user.password))
      return { success: false, errorCode: "wrong_password" };

    const loggedUser = await this.login({ user, staySignedIn });

    if (!loggedUser.success) return loggedUser;

    return { success: true, data: loggedUser.data };
  }

  static async resetPasswordMail(params: {
    email: string;
  }): Promise<CustomResponse<{ user: UserWithoutPassword }, "email_not_found">> {
    const { email } = params;

    const authManager = getAuthManager();
    const userDAO = getUserDAO();
    const emailClient = getEmailClient();

    const resetPasswordToken = authManager.generateRandomToken();

    const resetPasswordExpires = dayjs()
      .add(configs.PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES, "minutes")
      .toDate();

    const user = await userDAO.setResetPasswordToken({
      email,
      token: resetPasswordToken,
      expires: resetPasswordExpires,
    });

    if (!user) return { success: false, errorCode: "email_not_found" };

    await emailClient.sendResetPasswordMail({
      email,
      resetPasswordToken,
      language: user.language,
    });

    return { success: true, data: { user } };
  }

  static async resetPassword(params: {
    password: string;
    resetPasswordToken: string;
  }): Promise<CustomResponse<UserWithoutPassword, "user_not_found">> {
    const { password, resetPasswordToken } = params;

    const userDAO = getUserDAO();
    const authManager = getAuthManager();

    const newHashedPassword = authManager.hashPassword(password);

    const user = await userDAO.updateUserPassword({
      newHashedPassword,
      resetPasswordToken,
    });

    if (!user) return { success: false, errorCode: "user_not_found" };

    return { success: true, data: user };
  }

  static async updatePassword(params: {
    previousPassword: string;
    password: string;
    userId: string;
  }): Promise<
    CustomResponse<
      { user: UserWithoutPassword; token: string },
      | "user_not_found"
      | "missing_password"
      | "wrong_password"
      | "user_not_found_when_updating_password"
    >
  > {
    const { previousPassword, password, userId } = params;

    const userDAO = getUserDAO();
    const authManager = getAuthManager();

    const user = await userDAO.getUserWithPassword({ userId });

    if (!user) return { success: false, errorCode: "user_not_found" };

    if (!user.password) return { success: false, errorCode: "missing_password" };

    if (!authManager.comparePasswords(previousPassword, user.password))
      return { success: false, errorCode: "wrong_password" };

    const newHashedPassword = authManager.hashPassword(password);

    const newUser = await userDAO.updateUserPassword({
      newHashedPassword,
      userId,
    });

    if (!newUser)
      return { success: false, errorCode: "user_not_found_when_updating_password" };

    const token = authManager.encodeUser({
      decodedUser: {
        roles: newUser.roles,
        userId: newUser._id,
        amazonId: newUser.amazonId,
      },
      staySignedIn: false,
    });

    return { success: true, data: { user: newUser, token } };
  }

  static async emailValidation(params: {
    userId: string;
  }): Promise<CustomResponse<{ user: UserWithoutPassword }, "user_not_found">> {
    const { userId } = params;

    const userDAO = getUserDAO();

    const user = await userDAO.validateEmail({ userId });

    if (!user) return { success: false, errorCode: "user_not_found" };

    return { success: true, data: { user } };
  }

  static async validationMail(params: {
    email: string;
  }): Promise<
    CustomResponse<{ user: UserWithoutPassword }, "user_not_found" | "already_validated">
  > {
    const { email } = params;

    const userDAO = getUserDAO();
    const emailClient = getEmailClient();

    const user = await userDAO.getUser({ email });

    if (!user) return { success: false, errorCode: "user_not_found" };

    if (user.emailValidation) return { success: false, errorCode: "already_validated" };

    await emailClient.sendValidateMailAddressMail({
      email,
      userId: user._id,
      language: user.language,
    });

    return { success: true, data: { user } };
  }

  static async updateUserInfo(params: {
    userId: string;
    decoded: DecodedUser;
    updates: {
      name?: string;
      testerMessage?: string;
      sellerMessage?: string;
      paypalEmail?: string;
      amazonId?: string;
    };
  }): Promise<
    CustomResponse<
      { user: UserWithoutPassword; token: string },
      "user_not_found" | "unauthorized" | "name_already_used"
    >
  > {
    const { decoded, userId, updates } = params;

    const userDAO = getUserDAO();
    const authManager = getAuthManager();

    if (decoded.userId !== userId && !decoded.roles.includes(Role.ADMIN)) {
      return { success: false, errorCode: "unauthorized" };
    }

    const updateRes = await userDAO.updateUser({ userId, updates });

    if (!updateRes.success) return updateRes;

    const user = updateRes.data;

    const token = authManager.encodeUser({
      decodedUser: {
        roles: user.roles,
        userId: user._id,
        amazonId: user.amazonId,
      },
      staySignedIn: false,
    });

    return { success: true, data: { user, token } };
  }

  static async checkToken(params: { logged: boolean; decoded?: DecodedUser }): Promise<
    CustomResponse<
      | {
          user: null;
          check: boolean;
        }
      | {
          user: UserWithoutPassword;
          check: boolean;
          requestedTestsCount: number;
          processingTestsCount: number;
          completedTestsCount: number;
          cancelledTestsCount: number;
          guiltyTestsCount: number;
        }
      | { check: boolean },
      "user_not_found_when_logging"
    >
  > {
    const { logged, decoded } = params;

    const userDAO = getUserDAO();
    const testDAO = getTestDAO();

    if (!decoded?.userId) {
      return { success: true, data: { user: null, check: false } };
    }
    if (!logged) {
      const [
        user,
        requestedTestsCount,
        processingTestsCount,
        completedTestsCount,
        cancelledTestsCount,
        guiltyTestsCount,
      ] = await Promise.all([
        userDAO.getUser({ userId: decoded.userId }),
        testDAO.countTestWithStatues({
          userId: decoded.userId,
          statuses: GLOBAL_TEST_STATUSES.REQUESTED,
        }),
        testDAO.countTestWithStatues({
          userId: decoded.userId,
          statuses: GLOBAL_TEST_STATUSES.PROCESSING,
        }),
        testDAO.countTestWithStatues({
          userId: decoded.userId,
          statuses: GLOBAL_TEST_STATUSES.COMPLETED,
        }),
        testDAO.countTestWithStatues({
          userId: decoded.userId,
          statuses: GLOBAL_TEST_STATUSES.CANCELLED,
        }),
        testDAO.countTestWithStatues({
          userId: decoded.userId,
          statuses: GLOBAL_TEST_STATUSES.CANCELLED,
          withGuilty: true,
        }),
      ]);

      if (!user) return { success: false, errorCode: "user_not_found_when_logging" };

      return {
        success: true,
        data: {
          user,
          requestedTestsCount,
          processingTestsCount,
          completedTestsCount,
          cancelledTestsCount,
          guiltyTestsCount,
          check: true,
        },
      };
    }
    return { success: true, data: { check: true } };
  }

  static async sendContactUsEmail(name, email, message) {
    if (!name || !email || !message) {
      return Promise.reject({ status: 400, message: "Missing fields." });
    }

    return EmailController.sendEmail(
      FROM_MAIL_ADDRESS,
      email,
      MAIL_TEMPLATES_IDS.CONTACT_US["fr"],
      {
        name: name,
        message: message,
      }
    );
  }

  static async changeGender(userId, gender) {
    if (!userId || !gender) {
      return Promise.reject({ status: 400, message: "Missing fields." });
    }

    try {
      const user = await UserModel.findByIdAndUpdate(userId, { gender }, { new: true });
      return { user };
    } catch (err) {
      return Promise.reject(ErrorResponses.mongoose(err));
    }
  }

  static async getOne(userId) {
    if (!userId) {
      return Promise.reject({ status: 400, message: "Missing userId." });
    }

    try {
      const [user, processingTestsCount, completedTestsCount, guiltyTestsCount] =
        await Promise.all([
          UserModel.findById(userId),
          TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.PROCESSING),
          TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.COMPLETED),
          TestController.countTestWithStatues(
            userId,
            GLOBAL_TEST_STATUSES.CANCELLED,
            true
          ),
        ]);
      return {
        user: {
          createdAt: user.createdAt,
          email: user.email,
          gender: user.gender,
          name: user.name,
          roles: user.roles,
          sellerMessage: user.sellerMessage,
          _id: user._id,
        },
        processingTestsCount,
        completedTestsCount,
        guiltyTestsCount,
      };
    } catch (e) {
      return Promise.reject(ErrorResponses.mongoose(e));
    }
  }

  static async googleRegister(params) {
    const { email, name, roles, googleId, language } = params;

    const googleUser = await UserModel.findOne({ googleId });
    if (googleUser) return UserController.login(googleUser, false);

    const emailUser = await UserModel.findOne({ email });
    if (emailUser) {
      const newUser = await UserModel.updateOne(
        { _id: emailUser._id },
        { $set: { googleId } }
      );
      return UserController.login(newUser, false);
    }

    const user = await UserModel.findOne({ name });
    if (user) return Promise.reject({ status: 400, message: "name_already_used" });

    try {
      const newUser = await UserModel.create({
        email,
        name,
        roles,
        googleId,
        emailValidation: true,
        language,
      });
      return UserController.login(newUser, false);
    } catch (e) {
      return Promise.reject({ status: 500, message: e.message });
    }
  }

  static async googleLogin(params) {
    const { googleId, keepConnection } = params;
    const user = await UserModel.findOne({ googleId });
    if (user) return UserController.login(user, keepConnection);
    return Promise.reject({ status: 403, message: "not_registered_yet" });
  }

  static async facebookRegister({ accessToken, roles, language }) {
    try {
      const response = await axios.get("https://graph.facebook.com/v11.0/me", {
        params: {
          access_token: accessToken,
          fields: "id,name,email,first_name",
        },
      });

      const { id, name, email, first_name } = response.data;

      const facebookUser = await UserModel.findOne({ facebookId: id });
      if (facebookUser) return UserController.login(facebookUser, false);

      if (!email)
        return Promise.reject({ status: 403, message: "facebook_account_missing_email" });

      const emailUser = await UserModel.findOne({ email });
      if (emailUser) {
        const newUser = await UserModel.updateOne(
          { _id: emailUser._id },
          { $set: { facebookId: id } }
        );
        return UserController.login(newUser, false);
      }

      const userName = first_name
        ? first_name + Math.round(Math.random() * 10000).toString()
        : name;

      const user = await UserModel.findOne({ name: userName });
      if (user) return Promise.reject({ status: 400, message: "name_already_used" });

      const newUser = await UserModel.create({
        email,
        name: userName,
        roles,
        facebookId: id,
        emailValidation: true,
        language,
      });
      return UserController.login(newUser, false);
    } catch (e) {
      return Promise.reject({ status: 500, message: e.message });
    }
  }

  static async facebookLogin({ accessToken, keepConnection }) {
    try {
      const { data } = await axios.get("https://graph.facebook.com/v11.0/me", {
        params: {
          access_token: accessToken,
          fields: "id,name,email,first_name",
        },
      });

      const user = await UserModel.findOne({ facebookId: data.id });
      if (!user) return Promise.reject({ status: 403, message: "not_registered_yet" });
      return UserController.login(user, keepConnection);
    } catch (e) {
      return Promise.reject({ status: 500, message: e.message });
    }
  }

  static async updateLanguage(userId, language) {
    try {
      const user = await UserModel.findByIdAndUpdate(userId, { language }, { new: true });
      return { user };
    } catch (err) {
      return Promise.reject(ErrorResponses.mongoose(err));
    }
  }
}
