import { configs } from "@/configs.js";
import { UserController } from "@/controllers/user.controller.js";
import { decode } from "@/middlewares/decode.js";
import { withAuth } from "@/middlewares/withAuth.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { Role } from "@/utils/constants.js";
import { handleResponseForRoute } from "@/utils/CustomResponse.js";
import { BadRequestError } from "@/utils/exceptions/BadRequestError.js";
import { NotFoundRequestError } from "@/utils/exceptions/NotFoundRequestError.js";
import { ServerRequestError } from "@/utils/exceptions/ServerRequestError.js";
import { UnauthorizedRequestError } from "@/utils/exceptions/UnauthorizedRequestError.js";
import { Language } from "@/utils/Language.js";
import { zodValidationForRoute } from "@/utils/zodValidationForRoute.js";
import express from "express";
import { z } from "zod";

const router = express.Router();

router.post(
  "/register",
  asyncHandler(async (request, reply) => {
    const { name, email, password, roles, language } = zodValidationForRoute(
      request.body,
      z.object({
        name: z.string().trim(),
        email: z.string().trim().email(),
        password: z.string().trim().min(configs.MIN_PASSWORD_LENGTH),
        roles: z.array(z.nativeEnum(Role)),
        language: z.nativeEnum(Language),
      })
    );
    const res = await UserController.credentialRegister({
      roles,
      name,
      email,
      password,
      language,
    });
    reply.send(
      handleResponseForRoute(res, {
        duplicate_email: new BadRequestError("duplicate_email"),
        duplicate_name: new BadRequestError("duplicate_name"),
      })
    );
  })
);

router.post(
  "/login",
  asyncHandler(async (request, reply) => {
    const { email, password, keepConnection } = zodValidationForRoute(
      request.body,
      z.object({
        email: z.string().trim().email(),
        password: z.string().trim(),
        keepConnection: z.boolean(),
      })
    );

    const res = await UserController.credentialLogin({
      email,
      password,
      staySignedIn: keepConnection,
    });

    reply.send(
      handleResponseForRoute(res, {
        user_not_found_when_logging: new ServerRequestError(
          "user_not_found_when_logging"
        ),
        email_not_found: new NotFoundRequestError("email_not_found"),
        wrong_password: new UnauthorizedRequestError("wrong_password"),
        email_not_validated: new UnauthorizedRequestError("email_not_validated"),
        missing_password: new UnauthorizedRequestError("missing_password"),
      })
    );
  })
);

router.get(
  "/checkToken",
  decode,
  asyncHandler(async (request, reply) => {
    const { logged } = zodValidationForRoute(
      request.query,
      z.object({ logged: z.boolean() })
    );

    const res = await UserController.checkToken({ logged, decoded: request.decoded });

    reply.send(
      handleResponseForRoute(res, {
        user_not_found_when_logging: new ServerRequestError(
          "user_not_found_when_logging"
        ),
      })
    );
  })
);

router.post(
  "/resetPasswordMail",
  asyncHandler(async (request, reply) => {
    const { email } = zodValidationForRoute(
      request.body,
      z.object({ email: z.string().trim().email() })
    );
    const res = await UserController.resetPasswordMail({ email });
    reply.send(
      handleResponseForRoute(res, {
        email_not_found: new NotFoundRequestError("email_not_found"),
      })
    );
  })
);

router.post(
  "/resetPassword",
  asyncHandler(async (request, reply) => {
    const { password, resetPasswordToken } = zodValidationForRoute(
      request.body,
      z.object({
        password: z.string().trim().min(configs.MIN_PASSWORD_LENGTH),
        resetPasswordToken: z.string(),
      })
    );
    const res = await UserController.resetPassword({ password, resetPasswordToken });

    reply.send(
      handleResponseForRoute(res, {
        user_not_found: new NotFoundRequestError("user_not_found"),
      })
    );
  })
);

router.post(
  "/updatePassword",
  withAuth(),
  asyncHandler(async (request, reply) => {
    const { previousPassword, password } = zodValidationForRoute(
      request.body,
      z.object({
        previousPassword: z.string().trim(),
        password: z.string().trim().min(configs.MIN_PASSWORD_LENGTH),
      })
    );
    const { userId } = request.decoded!;

    const res = await UserController.updatePassword({
      previousPassword,
      password,
      userId,
    });

    reply.send(
      handleResponseForRoute(res, {
        missing_password: new BadRequestError("missing_password"),
        user_not_found: new NotFoundRequestError("user_not_found"),
        user_not_found_when_updating_password: new ServerRequestError(
          "user_not_found_when_updating_password"
        ),
        wrong_password: new BadRequestError("wrong_password"),
      })
    );
  })
);

router.post(
  "/emailValidation",
  asyncHandler(async (request, reply) => {
    const { userId } = zodValidationForRoute(
      request.body,
      z.object({ userId: z.string() })
    );

    const res = await UserController.emailValidation({ userId });

    reply.send(
      handleResponseForRoute(res, {
        user_not_found: new NotFoundRequestError("user_not_found"),
      })
    );
  })
);

router.post(
  "/validationMail",
  asyncHandler(async (request, reply) => {
    const { email } = zodValidationForRoute(
      request.body,
      z.object({ email: z.string() })
    );

    const res = await UserController.validationMail({ email });

    reply.send(
      handleResponseForRoute(res, {
        user_not_found: new NotFoundRequestError("user_not_found"),
        already_validated: new BadRequestError("already_validated"),
      })
    );
  })
);

router.post(
  "/updateUserInfo",
  withAuth(),
  asyncHandler(async (request, reply) => {
    const decoded = request.decoded!;
    const { data: updates, userId } = zodValidationForRoute(
      request.body,
      z.object({
        userId: z.string(),
        data: z.object({
          name: z.string().trim().min(1).optional(),
          testerMessage: z.string().trim().optional(),
          sellerMessage: z.string().trim().optional(),
          paypalEmail: z.string().trim().email().min(1).optional(),
          amazonId: z.string().trim().min(1).optional(),
        }),
      })
    );

    const res = await UserController.updateUserInfo({ decoded, userId, updates });

    reply.send(
      handleResponseForRoute(res, {
        user_not_found: new NotFoundRequestError("user_not_found"),
        unauthorized: new UnauthorizedRequestError("unauthorized"),
        name_already_used: new BadRequestError("name_already_used"),
      })
    );
  })
);

router.post(
  "/contact-us",
  asyncHandler(async (request, reply) => {
    const { name, email, message } = zodValidationForRoute(
      request.body,
      z.object({
        name: z.string().trim().min(1),
        email: z.string().trim().min(1).email(),
        message: z.string().trim().min(1),
      })
    );
    await UserController.sendContactUsEmail({ name, email, message });

    reply.send();
  })
);

router.get(
  "/:userId",
  asyncHandler(async (request, reply) => {
    const { userId } = zodValidationForRoute(
      request.params,
      z.object({ userId: z.string().min(1) })
    );
    const res = await UserController.getOne({ userId });
    reply.send(
      handleResponseForRoute(res, {
        user_not_found: new NotFoundRequestError("user_not_found"),
      })
    );
  })
);

router.post(
  "/google-register",
  asyncHandler(async (request, reply) => {
    const { name, email, googleId, roles, language } = zodValidationForRoute(
      request.body,
      z.object({
        name: z.string().trim().min(1),
        email: z.string().trim().min(1).email(),
        googleId: z.string().trim().min(1),
        roles: z.array(z.nativeEnum(Role)),
        language: z.nativeEnum(Language),
      })
    );

    const res = await UserController.googleRegister({
      roles,
      name,
      email,
      googleId,
      language,
    });

    reply.send(
      handleResponseForRoute(res, {
        name_already_used_when_adding_email: new ServerRequestError(
          "name_already_used_when_adding_email"
        ),
        user_not_found_when_adding_email: new ServerRequestError(
          "user_not_found_when_adding_email"
        ),
        user_not_found_when_logging: new ServerRequestError(
          "user_not_found_when_logging"
        ),
        duplicate_email: new ServerRequestError("duplicate_email"),
        duplicate_name: new BadRequestError("duplicate_name"),
      })
    );
  })
);

router.post(
  "/google-login",
  asyncHandler(async (request, reply) => {
    const { googleId, keepConnection } = zodValidationForRoute(
      request.body,
      z.object({
        googleId: z.string().trim().min(1),
        keepConnection: z.boolean(),
      })
    );

    const res = await UserController.googleLogin({
      staySignedIn: keepConnection,
      googleId,
    });

    reply.send(
      handleResponseForRoute(res, {
        user_not_found: new NotFoundRequestError("user_not_found"),
        user_not_found_when_logging: new ServerRequestError(
          "user_not_found_when_logging"
        ),
      })
    );
  })
);

router.post(
  "/facebook-register",
  asyncHandler(async (request, reply) => {
    const { accessToken, roles, language } = zodValidationForRoute(
      request.body,
      z.object({
        accessToken: z.string().trim().min(1),
        roles: z.array(z.nativeEnum(Role)),
        language: z.nativeEnum(Language),
      })
    );

    const res = await UserController.facebookRegister({ accessToken, roles, language });

    reply.send(
      handleResponseForRoute(res, {
        issue_with_facebook_login: new ServerRequestError("issue_with_facebook_login"),
        facebook_account_missing_email: new BadRequestError(
          "facebook_account_missing_email"
        ),
        name_already_used: new BadRequestError("name_already_used"),
        user_not_found_when_adding_email: new ServerRequestError(
          "user_not_found_when_adding_email"
        ),
        user_not_found_when_logging: new ServerRequestError(
          "user_not_found_when_logging"
        ),
        duplicate_email_when_creating_user: new ServerRequestError(
          "duplicate_email_when_creating_user"
        ),
        duplicate_name: new BadRequestError("duplicate_name"),
      })
    );
  })
);

router.post(
  "/facebook-login",
  asyncHandler(async (request, reply) => {
    const { accessToken, keepConnection } = zodValidationForRoute(
      request.body,
      z.object({
        accessToken: z.string().trim().min(1),
        keepConnection: z.boolean(),
      })
    );

    const res = await UserController.facebookLogin({
      accessToken,
      staySignedIn: keepConnection,
    });

    reply.send(
      handleResponseForRoute(res, {
        user_not_found: new NotFoundRequestError("user_not_found"),
        user_not_found_when_logging: new ServerRequestError(
          "user_not_found_when_logging"
        ),
        facebook_account_missing_email: new BadRequestError(
          "facebook_account_missing_email"
        ),
        issue_with_facebook_login: new ServerRequestError("issue_with_facebook_login"),
      })
    );
  })
);

router.post(
  "/update-language",
  withAuth(),
  asyncHandler(async (request, reply) => {
    const { language } = zodValidationForRoute(
      request.body,
      z.object({
        language: z.nativeEnum(Language),
      })
    );

    const { userId } = request.decoded!;

    const res = await UserController.updateLanguage({ userId, language });

    reply.send(
      handleResponseForRoute(res, {
        user_not_found: new NotFoundRequestError("user_not_found"),
      })
    );
  })
);

export default router;
