const frontRoutes = require('./routes/front.routes');
const userRoutes = require('./routes/user.routes');

async function routes (fastify) {
    frontRoutes(fastify);
    userRoutes(fastify);
}

module.exports = routes;
