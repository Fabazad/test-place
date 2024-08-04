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

  static async resetPassword(password, resetPasswordToken) {
    return new Promise((resolve, reject) => {
      if (password.length < 8) {
        return reject({ status: 400, message: "Password too short." });
      }
      if (!resetPasswordToken) {
        return reject({ status: 400, message: "Missing token." });
      }
      UserModel.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gte: new Date() },
      })
        .then((user) => {
          if (!user) {
            return reject({ status: 403, message: "Wrong or expired token." });
          }
          user.password = password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.save((err) => {
            if (err) {
              reject(ErrorResponses.mongoose(err));
            } else {
              resolve({ user });
            }
          });
        })
        .catch((err) => reject(ErrorResponses.mongoose(err)));
    });
  }

  static async updatePassword(previousPassword, password, userId) {
    return new Promise((resolve, reject) => {
      if (password.length < 8) {
        return reject({ status: 400, message: "Password too short." });
      }
      if (!userId) {
        return reject({ status: 400, message: "Missing user token." });
      }
      UserModel.findById(userId)
        .then((user) => {
          if (!user) {
            return reject({ status: 403, message: "Wrong user token." });
          }
          user.isCorrectPassword(previousPassword, (err, same) => {
            if (err) {
              reject({ status: 500, message: "Internal error please try again." });
            } else if (!same) {
              reject({ status: 400, message: "Incorrect current password." });
            } else {
              // Issue token
              user.password = password;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              user
                .save()
                .then((user) => {
                  const token = createToken(user, "1h");
                  resolve({ user, token });
                })
                .catch((err) => reject(ErrorResponses.mongoose(err)));
            }
          });
        })
        .catch((err) => reject({ status: 500, message: err }));
    });
  }

  static async emailValidation(userId) {
    return new Promise((resolve, reject) => {
      if (!userId) {
        return reject({ status: 400, message: "Missing token." });
      }
      UserModel.findByIdAndUpdate(userId, { $set: { emailValidation: true } })
        .then((user) => {
          if (!user) {
            return reject({ status: 403, message: "Wrong token." });
          }
          resolve({ user });
        })
        .catch((err) => reject(ErrorResponses.mongoose(err)));
    });
  }

  static async validationMail(email) {
    return new Promise((resolve, reject) => {
      if (!email) {
        reject({ status: 400, message: "Missing email." });
      }
      UserModel.findOne({ email })
        .then((user) => {
          if (!user) {
            return reject({ status: 400, message: "No user with this email found." });
          }
          if (user.emailValidation) {
            return reject({ status: 403, message: "Email already validated." });
          }
          EmailController.sendValidateMailAddressMail(email, user._id.toString())
            .then(() => resolve({ user }))
            .catch((err) => reject({ status: 500, message: err }));
        })
        .catch((err) => reject(ErrorResponses.mongoose(err)));
    });
  }

  static async updateUserInfo(
    currentUserId,
    currentUserAmazonId,
    currentUserRoles,
    userId,
    data
  ) {
    return new Promise(async (resolve, reject) => {
      if (currentUserId !== userId && !currentUserRoles.includes(ROLES.ADMIN)) {
        return reject({ status: 403, message: "Unauthorized" });
      }

      if ("roles" in data) {
        if (
          currentUserRoles.includes(ROLES.TESTER) &&
          !data.roles.includes(ROLES.TESTER)
        ) {
          const processingTestNumber = await TestModel.count({
            status: {
              $in: [
                TEST_STATUSES.requested,
                TEST_STATUSES.requestAccepted,
                TEST_STATUSES.productOrdered,
                TEST_STATUSES.productReceived,
                TEST_STATUSES.productReviewed,
                TEST_STATUSES.reviewValidated,
                //TODO complete
              ],
            },
            tester: currentUserId,
          });

          if (processingTestNumber) {
            return reject({
              status: 403,
              message:
                "You have to stay tester until you finish to precess all your tests.",
            });
          }
        }

        if (
          currentUserRoles.includes(ROLES.SELLER) &&
          !data.roles.includes(ROLES.SELLER)
        ) {
          const processingTestNumber = await TestModel.count({
            status: {
              $in: [
                TEST_STATUSES.requested,
                TEST_STATUSES.requestAccepted,
                TEST_STATUSES.productOrdered,
                TEST_STATUSES.productReceived,
                TEST_STATUSES.productReviewed,
                TEST_STATUSES.reviewValidated,
                //TODO complete
              ],
            },
            seller: currentUserId,
          });

          if (processingTestNumber) {
            return reject({
              status: 403,
              message:
                "You have to stay tester until you finish to precess all your tests.",
            });
          }
        }
      }

      const authorizedData = [
        "testerMessage",
        "sellerMessage",
        "roles",
        "paypalEmail",
        "amazonId",
        "name",
      ];
      Object.keys(data).forEach((key) => {
        if (!authorizedData.includes(key)) delete data[key];
        if (["paypalEmail", "amazonId"].includes(key) && !data[key]) {
          return reject({
            status: 400,
            message: "Can't remove paypalEmail or Amazon Id.",
          });
        }
      });

      if ("name" in data) {
        const countWithName = await UserModel.count({ name: data.name });
        if (countWithName > 0)
          return reject({ status: 400, message: "name_already_used" });
      }

      UserModel.findByIdAndUpdate(userId, data, { new: true })
        .then((user) => {
          const token = createToken(user, "1h");
          resolve({ user, token });
        })
        .catch((err) => reject(ErrorResponses.mongoose(err)));
    });
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
