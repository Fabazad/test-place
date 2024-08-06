import { configs } from "@/configs.js";
import { getTestDAO } from "@/entities/Test/dao/test.dao.index.js";
import { getUserDAO } from "@/entities/User/dao/user.dao.index.js";
import { UserWithoutPassword } from "@/entities/User/user.entity.js";
import { SignedInUser } from "@/entities/User/user.helpers.js";
import { getAuthManager } from "@/libs/AuthManager/index.js";
import { getEmailClient } from "@/libs/EmailClient/index.js";
import { GLOBAL_TEST_STATUSES, Role } from "@/utils/constants.js";
import { CustomResponse, formatFailedResponse } from "@/utils/CustomResponse.js";
import { DecodedUser } from "@/utils/DecodedUser.type.js";
import { Language } from "@/utils/Language.js";
import dayjs from "dayjs";

export class UserController {
  static async credentialRegister(params: {
    roles: Array<Role>;
    name: string;
    email: string;
    password: string;
    language: Language;
  }): Promise<CustomResponse<undefined, "duplicate_email" | "duplicate_name">> {
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

    return { success: true, data: undefined };
  }

  static async login(params: {
    user: UserWithoutPassword;
    staySignedIn: boolean;
  }): Promise<CustomResponse<SignedInUser, "user_not_found_when_logging">> {
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
      SignedInUser,
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

  static async sendContactUsEmail(params: {
    name: string;
    email: string;
    message: string;
  }) {
    const { name, email, message } = params;

    const emailClient = getEmailClient();

    await emailClient.sendContactUsMail({ name, email, language: Language.FR, message });
  }

  static async getOne(params: { userId: string }): Promise<
    CustomResponse<
      {
        user: UserWithoutPassword;
        processingTestsCount: number;
        completedTestsCount: number;
        guiltyTestsCount: number;
      },
      "user_not_found"
    >
  > {
    const { userId } = params;

    const userDAO = getUserDAO();

    const testDAO = getTestDAO();

    const [user, processingTestsCount, completedTestsCount, guiltyTestsCount] =
      await Promise.all([
        userDAO.getUser({ userId }),
        testDAO.countTestWithStatues({
          userId,
          statuses: GLOBAL_TEST_STATUSES.PROCESSING,
        }),
        testDAO.countTestWithStatues({
          userId,
          statuses: GLOBAL_TEST_STATUSES.COMPLETED,
        }),
        testDAO.countTestWithStatues({
          userId,
          statuses: GLOBAL_TEST_STATUSES.CANCELLED,
          withGuilty: true,
        }),
      ]);

    if (!user) return { success: false, errorCode: "user_not_found" };

    return {
      success: true,
      data: {
        user,
        processingTestsCount,
        completedTestsCount,
        guiltyTestsCount,
      },
    };
  }

  static async googleRegister(params: {
    email: string;
    name: string;
    roles: Array<Role>;
    googleId: string;
    language: Language;
  }): Promise<
    CustomResponse<
      SignedInUser,
      | "user_not_found_when_logging"
      | "user_not_found_when_adding_email"
      | "name_already_used_when_adding_email"
      | "duplicate_email"
      | "duplicate_name"
    >
  > {
    const { email, name, roles, googleId, language } = params;

    const userDAO = getUserDAO();

    const googleUser = await userDAO.getUser({ googleId });

    if (googleUser) return this.login({ user: googleUser, staySignedIn: false });

    const emailUser = await userDAO.getUserWithPassword({ email });
    if (emailUser) {
      const updateUserRes = await userDAO.updateUser({
        userId: emailUser._id,
        updates: { googleId },
      });
      if (!updateUserRes.success) {
        return formatFailedResponse(updateUserRes, {
          user_not_found: "user_not_found_when_adding_email",
          name_already_used: "name_already_used_when_adding_email",
        });
      }
      return this.login({ user: updateUserRes.data, staySignedIn: false });
    }

    const createUserRes = await userDAO.createUser({
      userData: {
        name,
        email,
        roles,
        googleId,
        emailValidation: true,
        language,
        isCertified: false,
        password: null,
      },
    });

    if (!createUserRes.success) return createUserRes;

    return this.login({ user: createUserRes.data, staySignedIn: false });
  }

  static async googleLogin(params: {
    googleId: string;
    staySignedIn: boolean;
  }): Promise<
    CustomResponse<SignedInUser, "user_not_found" | "user_not_found_when_logging">
  > {
    const { googleId, staySignedIn } = params;

    const userDAO = getUserDAO();

    const user = await userDAO.getUser({ googleId });

    if (!user) return { success: false, errorCode: "user_not_found" };

    return UserController.login({ user, staySignedIn });
  }

  static async facebookRegister(params: {
    accessToken: string;
    roles: Array<Role>;
    language: Language;
  }): Promise<
    CustomResponse<
      SignedInUser,
      | "issue_with_facebook_login"
      | "facebook_account_missing_email"
      | "name_already_used"
      | "user_not_found_when_adding_email"
      | "user_not_found_when_logging"
      | "duplicate_email_when_creating_user"
      | "duplicate_name"
    >
  > {
    const { accessToken, roles, language } = params;

    const authManager = getAuthManager();
    const userDAO = getUserDAO();

    const facebookLoginRes = await authManager.facebookLogin({ accessToken });

    if (!facebookLoginRes.success)
      return formatFailedResponse(facebookLoginRes, {
        unknown_error: "issue_with_facebook_login",
        facebook_account_missing_email: "facebook_account_missing_email",
      });

    const facebookData = facebookLoginRes.data;

    const emailUser = await userDAO.getUser({ email: facebookData.email });

    if (emailUser) {
      const updateUserRes = await userDAO.updateUser({
        userId: emailUser._id,
        updates: { facebookId: facebookData.facebookId },
      });

      if (!updateUserRes.success) {
        return formatFailedResponse(updateUserRes, {
          name_already_used: "name_already_used",
          user_not_found: "user_not_found_when_adding_email",
        });
      }

      return this.login({ user: updateUserRes.data, staySignedIn: false });
    }

    const createUserRes = await userDAO.createUser({
      userData: {
        name: facebookData.name,
        email: facebookData.email,
        roles,
        facebookId: facebookData.facebookId,
        emailValidation: true,
        language,
        isCertified: false,
        password: null,
      },
    });

    if (!createUserRes.success)
      return formatFailedResponse(createUserRes, {
        duplicate_email: "duplicate_email_when_creating_user",
        duplicate_name: "duplicate_name",
      });

    return this.login({ user: createUserRes.data, staySignedIn: false });
  }

  static async facebookLogin(params: {
    accessToken: string;
    staySignedIn: boolean;
  }): Promise<
    CustomResponse<
      SignedInUser,
      | "user_not_found"
      | "user_not_found_when_logging"
      | "facebook_account_missing_email"
      | "issue_with_facebook_login"
    >
  > {
    const { accessToken, staySignedIn } = params;

    const authManager = getAuthManager();
    const userDAO = getUserDAO();

    const facebookLoginRes = await authManager.facebookLogin({ accessToken });

    if (!facebookLoginRes.success)
      return formatFailedResponse(facebookLoginRes, {
        unknown_error: "issue_with_facebook_login",
        facebook_account_missing_email: "facebook_account_missing_email",
      });

    const facebookData = facebookLoginRes.data;

    const facebookUser = await userDAO.getUser({ facebookId: facebookData.facebookId });

    if (!facebookUser) return { success: false, errorCode: "user_not_found" };

    return this.login({ user: facebookUser, staySignedIn });
  }

  static async updateLanguage(params: {
    userId: string;
    language: Language;
  }): Promise<CustomResponse<UserWithoutPassword, "user_not_found">> {
    const { userId, language } = params;

    const userDAO = getUserDAO();

    const user = await userDAO.updateUserWIthNoUniqueField({
      userId,
      updates: { language },
    });

    if (!user) return { success: false, errorCode: "user_not_found" };

    return { success: true, data: user };
  }
}
