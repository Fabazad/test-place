const UserController = require('../controllers/user.controller');
fastify.register(require('fastify-cookie'));
const withAuth = require('./middleware');

async function userRoutes (fastify) {

    const path = "/api/user/";
    fastify.post(path + 'register', async (request, reply) => {
        const { user } = request.body;
        return await UserController.register(user);
    });
    fastify.post(path + 'login', async (request, reply) => {
        const { email, password } = request.body;
        const token =  await UserController.login(email, password);
        if (token) {
            reply.setCookie('token', token, { httpOnly: true }).send();
        }
    });
}

module.exports = userRoutes