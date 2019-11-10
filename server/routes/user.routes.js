const UserController = require('../controllers/user.controller');

async function userRoutes (fastify) {
    fastify.register(require('fastify-cookie'));
    const path = "/api/user/";

    fastify.post(path + 'register', async (request, reply) => {
        const { name, email, password } = request.body;
        UserController.register(name, email, password)
            .then(() => reply.code(200).send())
            .catch(err => reply.code(err.status).send(err.message));
    });

    fastify.post(path + 'login', async (request, reply) => {
        const { email, password } = request.body;
        UserController.login(email, password)
            .then(token => {
                console.info(token);
                reply.setCookie('token', token, { httpOnly: true }).send()
            } )
            .catch(err => reply.code(err.status).send(err.message));
    });
}

module.exports = userRoutes