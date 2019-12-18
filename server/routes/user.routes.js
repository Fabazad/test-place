const UserController = require('../controllers/user.controller');
const withAuth = require('../middlewares/withAuth');
const middlewares = require("../middlewares/middlewares");

async function userRoutes (fastify) {
    const path = "/api/user/";

    fastify.post(path + 'register', async (request, reply) => {
        const { email, password, role, captcha } = request.body;
        UserController.register(email, password, role, captcha)
            .then(() => reply.code(200).send())
            .catch(err => reply.code(err.status).send(err.message));
    });

    fastify.post(path + 'login', async (request, reply) => {
        const { email, password } = request.body;
        UserController.login(email, password)
            .then(res => reply.send(res))
            .catch(err => reply.code(err.status).send(err.message));
    });

    fastify.get(path + 'checkToken', async (request, reply) => {
        middlewares(request, reply, [withAuth], () => {
            reply.send({ userId: request.userId, role: request.role });
        });
    });

    fastify.post(path + 'resetPasswordMail', async (request, reply) => {
        const { email } = request.body;
        UserController.resetPasswordMail(email)
            .then(() => reply.send())
            .catch(err => reply.code(err.status).send(err.message));
    });

    fastify.post(path + 'resetPassword', async (request, reply) => {
        const { password, resetPasswordToken } = request.body;
        UserController.resetPassword(password, resetPasswordToken)
            .then(() => reply.send())
            .catch(err => reply.code(err.status).send(err.message));
    });

    fastify.post(path + 'updatePassword', async (request, reply) => {
        middlewares(request, reply, [withAuth], () => {
            const { previousPassword, password } = request.body;
            const { userId } = request;
            UserController.updatePassword(previousPassword, password, userId)
                .then(() => reply.send())
                .catch(err => reply.code(err.status).send(err.message));
        });
    });

    fastify.post(path + 'emailValidation', async (request, reply) => {
        const { userId } = request.body;
        UserController.emailValidation(userId)
            .then(() => reply.send())
            .catch(err => reply.code(err.status).send(err.message));
    });

    fastify.post(path + 'amazonLogin', async (request, reply) => {
        middlewares(request, reply, [withAuth], () => {

            const { amazonToken } = request.body;
            const { userId } = request;
            UserController.amazonLogin(userId, amazonToken)
                .then(user => reply.send(user))
                .catch(err => reply.code(err.status).send(err.message));
        });
    });
}

module.exports = userRoutes;