const UserController = require('../controllers/user.controller');
const withAuth = require('../middlewares/withAuth');
const express = require('express');
const router = express.Router();

router.post('/register', async (request, reply) => {
    const {name, email, password, captcha} = request.body;
    UserController.register(name, email, password, captcha)
        .then(user => reply.send(user))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/login', async (request, reply) => {
    const {email, password} = request.body;
    UserController.login(email, password)
        .then(res => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.get('/checkToken', withAuth, async (request, res) => {
    res.send({userId: request.userId, amazonId: request.amazonId});
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

router.post('/updatePassword', withAuth, async (request, reply) => {
    const {previousPassword, password} = request.body;
    const {userId} = request;
    UserController.updatePassword(previousPassword, password, userId)
        .then(() => reply.send())
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/emailValidation', async (request, reply) => {
    const {userId} = request.body;
    UserController.emailValidation(userId)
        .then(() => reply.send())
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/amazonLogin', withAuth, async (request, reply) => {

    const {amazonToken} = request.body;
    const {userId} = request;
    UserController.amazonLogin(userId, amazonToken)
        .then(user => reply.send(user))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/update', withAuth, async (request, reply) => {

    const {itemId, fields} = request.body;
    const {userId} = request;
    UserController.update(userId, itemId, fields)
        .then(user => reply.send(user))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/validationMail', async (request, reply) => {
    const {email} = request.body;
    UserController.validationMail(email)
        .then(() => reply.send())
        .catch(err => reply.status(err.status).send(err.message));
});

module.exports = router;