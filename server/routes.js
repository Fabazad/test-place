const frontRoutes = require('./routes/front.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const s3Routes = require('./routes/s3.routes');

async function routes (fastify) {
    frontRoutes(fastify);
    userRoutes(fastify);
    productRoutes(fastify);
    s3Routes(fastify);
}

module.exports = routes;
