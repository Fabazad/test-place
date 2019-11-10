const frontRoutes = require('./routes/front.routes');
const stepRoutes = require('./routes/step.routes');

async function routes (fastify) {
    frontRoutes(fastify);
    stepRoutes(fastify);
}

module.exports = routes;
