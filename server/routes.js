const frontRoutes = require('./routes/front.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');

async function routes (fastify) {
    frontRoutes(fastify);
    userRoutes(fastify);
    productRoutes(fastify);
}

module.exports = routes;
