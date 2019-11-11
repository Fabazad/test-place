const UserController = require('../controllers/user.controller');
const withAuth = require('../middlewares/withAuth');
const middlewares = require("../middlewares/middlewares");

async function userRoutes (fastify) {
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
                reply.send({token});
            })
            .catch(err => reply.code(err.status).send(err.message));
    });

    fastify.get(path + 'checkToken', async (request, reply) => {
        middlewares(request, reply, [withAuth], () => {
            reply.send();
        });
    });
}

module.exports = userRoutes