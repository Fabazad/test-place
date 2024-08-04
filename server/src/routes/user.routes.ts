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
      password: z.string().trim().min(8),
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
  const { password, resetPasswordToken } = request.body;
  UserController.resetPassword(password, resetPasswordToken)
    .then(() => reply.send())
    .catch((err) => reply.status(err.status).send(err.message));
});

router.post("/updatePassword", withAuth(), async (request, reply) => {
  const { previousPassword, password } = request.body;
  const { userId } = request.decoded;
  UserController.updatePassword(previousPassword, password, userId)
    .then((res) => reply.send(res))
    .catch((err) => reply.status(err.status).send(err.message));
});

router.post("/emailValidation", async (request, reply) => {
  const { userId } = request.body;
  UserController.emailValidation(userId)
    .then(() => reply.send())
    .catch((err) => reply.status(err.status).send(err.message));
});

router.post("/validationMail", async (request, reply) => {
  const { email } = request.body;
  UserController.validationMail(email)
    .then(() => reply.send())
    .catch((err) => reply.status(err.status).send(err.message));
});

router.post("/updateUserInfo", withAuth(), async (request, reply) => {
  const { userId, data } = request.body;
  const bodySchema = joi
    .object({
      name: joi.string().trim().not().empty(),
    })
    .options({ allowUnknown: true });
  const { error } = bodySchema.validate(data);
  if (error !== undefined) return reply.status(400).send(error.message);
  const { decoded } = request;
  UserController.updateUserInfo(
    decoded.userId,
    decoded.amazonId,
    decoded.roles,
    userId,
    data
  )
    .then((res) => reply.send(res))
    .catch((err) => reply.status(err.status).send(err.message));
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
