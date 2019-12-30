const frontRoutes = require('./routes/front.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const s3Routes = require('./routes/s3.routes');
const fs = require('fs');
const path = require('path');
path.resolve(__dirname, './SSL/key.key');

async function routes (fastify) {
    frontRoutes(fastify);
    userRoutes(fastify);
    productRoutes(fastify);
    s3Routes(fastify);
    fastify.get('/webroot/.well-known/acme-challenge/2AJ42NJDBxmMtB_fO2vqxzfz1vl3QgYIMveFpio3XMw', async (request, reply) => {
        const stream = fs.createReadStream(path.resolve(__dirname, './SSL/test-place'), 'utf8')
        reply.send(stream)
    });
    fastify.get('/webroot/.well-known/acme-challenge/OCLh7gW-XN6ayikx5SwE6DA8Ulvf-p1EJivIRMlgRRU', async (request, reply) => {
        const stream = fs.createReadStream(path.resolve(__dirname, './SSL/www-test-place'), 'utf8')
        reply.send(stream)
    });
}

module.exports = routes;
