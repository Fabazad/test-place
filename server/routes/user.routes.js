const UserController = require('../controllers/user.controller');
const withAuth = require('../middlewares/withAuth');
const express = require('express');
const router = express.Router();
const joi = require('joi')

router.post('/register', async (request, reply) => {
    const {name, email, password, captcha, roles} = request.body;
    UserController.credentialRegister(roles, name, email, password, captcha)
        .then(() => reply.send())
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/login', async (request, reply) => {
    const bodySchema = joi.object({
        email: joi.string().trim().not().empty().email().required(),
        password: joi.string().trim().not().empty().required(),
        keepConnection: joi.boolean()
    });
    const { error, value } = bodySchema.validate(request.body, { errors: { language: "french" }});
    if (error !== undefined) return reply.status(400).send(error.message);
    const {email, password, keepConnection} = value;
    UserController.credentialLogin(email, password, keepConnection)
        .then(res => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.get('/checkToken', async (request, res) => {
    UserController.checkToken(request.query.logged, request.decoded)
        .then(data => res.send(data))
        .catch(err => res.status(err.status).send(err.message));
});

router.post('/resetPasswordMail', async (request, reply) => {
    const {email} = request.body;
    UserController.resetPasswordMail(email)
        .then(() => reply.send())
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/resetPassword', async (request, reply) => {
    const {password, resetPasswordToken} = request.body;
    UserController.resetPassword(password, resetPasswordToken)
        .then(() => reply.send())
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/updatePassword', withAuth(), async (request, reply) => {
    const {previousPassword, password} = request.body;
    const {userId} = request.decoded;
    UserController.updatePassword(previousPassword, password, userId)
        .then(res => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/emailValidation', async (request, reply) => {
    const {userId} = request.body;
    UserController.emailValidation(userId)
        .then(() => reply.send())
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/validationMail', async (request, reply) => {
    const {email} = request.body;
    UserController.validationMail(email)
        .then(() => reply.send())
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/updateUserInfo', withAuth(), async (request, reply) => {
    const { userId, data } = request.body;
    const bodySchema = joi.object({
        name: joi.string().trim().not().empty()
    }).options({ allowUnknown: true });
    const { error } = bodySchema.validate(data);
    if (error !== undefined) return reply.status(400).send(error.message);
    const {decoded} = request;
    UserController.updateUserInfo(decoded.userId, decoded.amazonId, decoded.roles, userId, data)
        .then((res) => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/contact-us', async (request, reply) => {
    const { name, email, message } = request.body;
    UserController.sendContactUsEmail(name, email, message)
        .then((res) => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/change-gender', withAuth(), async (request, reply) => {
    const { gender } = request.body;
    const {decoded} = request;
    UserController.changeGender(decoded.userId, gender)
        .then((res) => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.get('/:userId', async (request, reply) => {
    const { userId } = request.params;
    UserController.getOne(userId)
        .then((res) => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/google-register', async (request, reply) => {
    const bodySchema = joi.object({
        name: joi.string().trim().not().empty().required(),
        email: joi.string().trim().not().empty().required(),
        googleId: joi.string().trim().not().empty().required(),
        roles: joi.array().items(joi.string().trim().not().empty()).required()
    });
    const { error, value } = bodySchema.validate(request.body);
    if (error !== undefined) return reply.status(400).send(error.message);
    const {name, email, googleId, roles} = value;
    UserController.googleRegister({roles, name, email, googleId})
        .then((res) => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/google-login', async (request, reply) => {
    const bodySchema = joi.object({
        googleId: joi.string().trim().not().empty().required(),
        keepConnection: joi.boolean().optional(),
    });
    const { error, value } = bodySchema.validate(request.body);
    if (error !== undefined) return reply.status(400).send(error.message);
    const {googleId, keepConnection} = value;
    UserController.googleLogin({keepConnection, googleId})
        .then((data) => reply.send(data))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/facebook-register', async (request, reply) => {
    const bodySchema = joi.object({
        accessToken: joi.string().trim().not().empty().required(),
        roles: joi.array().items(joi.string().trim().not().empty()).required()
    });
    const { error, value } = bodySchema.validate(request.body);
    if (error !== undefined) return reply.status(400).send(error.message);
    const {accessToken, roles} = value;
    UserController.facebookRegister({accessToken, roles})
        .then((data) => reply.send(data))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/facebook-login', async (request, reply) => {
    const bodySchema = joi.object({
        accessToken: joi.string().trim().not().empty().required(),
        keepConnection: joi.boolean().optional(),
    });
    const { error, value } = bodySchema.validate(request.body);
    if (error !== undefined) return reply.status(400).send(error.message);
    const {accessToken, keepConnection} = value;
    UserController.facebookLogin({accessToken, keepConnection})
        .then((data) => reply.send(data))
        .catch(err => reply.status(err.status).send(err.message));
});

module.exports = router;