import { configs } from "@/configs.js";
import { UserController } from "@/controllers/user.controller.js";
import { decode } from "@/middlewares/decode.js";
import { withAuth } from "@/middlewares/withAuth.js";
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

router.post("/register", async (request, reply) => {
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
    })
  );
});

router.post("/login", async (request, reply) => {
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
      user_not_found_when_logging: new ServerRequestError("user_not_found_when_logging"),
      email_not_found: new NotFoundRequestError("email_not_found"),
      wrong_password: new UnauthorizedRequestError("wrong_password"),
      email_not_validated: new UnauthorizedRequestError("email_not_validated"),
      missing_password: new UnauthorizedRequestError("missing_password"),
    })
  );
});

router.get("/checkToken", decode, async (request, reply) => {
  const { logged } = zodValidationForRoute(
    request.query,
    z.object({ logged: z.boolean() })
  );

  const res = await UserController.checkToken({ logged, decoded: request.decoded });

  reply.send(
    handleResponseForRoute(res, {
      user_not_found_when_logging: new ServerRequestError("user_not_found_when_logging"),
    })
  );
});

router.post("/resetPasswordMail", async (request, reply) => {
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
});

router.post("/resetPassword", async (request, reply) => {
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
});

router.post("/updatePassword", withAuth(), async (request, reply) => {
  const { previousPassword, password } = zodValidationForRoute(
    request.body,
    z.object({
      previousPassword: z.string().trim(),
      password: z.string().trim().min(configs.MIN_PASSWORD_LENGTH),
    })
  );
  const { userId } = request.decoded!;

  const res = await UserController.updatePassword({ previousPassword, password, userId });

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
});

router.post("/emailValidation", async (request, reply) => {
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
});

router.post("/validationMail", async (request, reply) => {
  const { email } = zodValidationForRoute(request.body, z.object({ email: z.string() }));

  const res = await UserController.validationMail({ email });

  reply.send(
    handleResponseForRoute(res, {
      user_not_found: new NotFoundRequestError("user_not_found"),
      already_validated: new BadRequestError("already_validated"),
    })
  );
});

router.post("/updateUserInfo", withAuth(), async (request, reply) => {
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
});

router.post("/contact-us", async (request, reply) => {
  const { name, email, message } = request.body;
  UserController.sendContactUsEmail(name, email, message)
    .then((res) => reply.send(res))
    .catch((err) => reply.status(err.status).send(err.message));
});

router.post("/change-gender", withAuth(), async (request, reply) => {
  const { gender } = request.body;
  const { decoded } = request;
  UserController.changeGender(decoded.userId, gender)
    .then((res) => reply.send(res))
    .catch((err) => reply.status(err.status).send(err.message));
});

router.get("/:userId", async (request, reply) => {
  const { userId } = request.params;
  UserController.getOne(userId)
    .then((res) => reply.send(res))
    .catch((err) => reply.status(err.status).send(err.message));
});

router.post("/google-register", async (request, reply) => {
  const bodySchema = joi.object({
    name: joi.string().trim().not().empty().required(),
    email: joi.string().trim().not().empty().required(),
    googleId: joi.string().trim().not().empty().required(),
    roles: joi.array().items(joi.string().trim().not().empty()).required(),
    language: joi
      .string()
      .required()
      .valid(...["en", "fr", "ch"]),
  });
  const { error, value } = bodySchema.validate(request.body);
  if (error !== undefined) return reply.status(400).send(error.message);
  const { name, email, googleId, roles, language } = value;
  UserController.googleRegister({ roles, name, email, googleId, language })
    .then((res) => reply.send(res))
    .catch((err) => reply.status(err.status).send(err.message));
});

router.post("/google-login", async (request, reply) => {
  const bodySchema = joi.object({
    googleId: joi.string().trim().not().empty().required(),
    keepConnection: joi.boolean().optional(),
  });
  const { error, value } = bodySchema.validate(request.body);
  if (error !== undefined) return reply.status(400).send(error.message);
  const { googleId, keepConnection } = value;
  UserController.googleLogin({ keepConnection, googleId })
    .then((data) => reply.send(data))
    .catch((err) => reply.status(err.status).send(err.message));
});

router.post("/facebook-register", async (request, reply) => {
  const bodySchema = joi.object({
    accessToken: joi.string().trim().not().empty().required(),
    roles: joi.array().items(joi.string().trim().not().empty()).required(),
    language: joi
      .string()
      .required()
      .valid(...["en", "fr", "ch"]),
  });
  const { error, value } = bodySchema.validate(request.body);
  if (error !== undefined) return reply.status(400).send(error.message);
  const { accessToken, roles, language } = value;
  UserController.facebookRegister({ accessToken, roles, language })
    .then((data) => reply.send(data))
    .catch((err) => reply.status(err.status).send(err.message));
});

router.post("/facebook-login", async (request, reply) => {
  const bodySchema = joi.object({
    accessToken: joi.string().trim().not().empty().required(),
    keepConnection: joi.boolean().optional(),
  });
  const { error, value } = bodySchema.validate(request.body);
  if (error !== undefined) return reply.status(400).send(error.message);
  const { accessToken, keepConnection } = value;
  UserController.facebookLogin({ accessToken, keepConnection })
    .then((data) => reply.send(data))
    .catch((err) => reply.status(err.status).send(err.message));
});

router.post("/update-language", withAuth(), async (request, reply) => {
  const bodySchema = joi.object({
    language: joi
      .string()
      .required()
      .valid(...["en", "fr", "ch"]),
  });
  const { error, value } = bodySchema.validate(request.body);
  if (error !== undefined) return reply.status(400).send(error.message);
  const { language } = value;
  const { decoded } = request;
  UserController.updateLanguage(decoded.userId, language)
    .then((res) => reply.send(res))
    .catch((err) => reply.status(err.status).send(err.message));
});

module.exports = router;
