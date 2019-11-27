const ProductController = require('../controllers/product.controller')

async function productRoutes (fastify) {
    const path = "/api/product/";

    fastify.get(path + 'srapFromAsin/:asin', async (request, reply) => {
        const { asin } = request.params;
        ProductController.scrapFromAsin(asin)
            .then((res) => reply.code(200).send(res))
            .catch(err => reply.code(err.status).send(err.message));
    });
}

module.exports = productRoutes