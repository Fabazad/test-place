const ProductController = require('../controllers/product.controller');
const middlewares = require("../middlewares/middlewares");
const withAuth = require('../middlewares/withAuth');

async function productRoutes (fastify) {
    const path = "/api/product/";

    fastify.get(path + 'srapFromAsin/:asin', async (request, reply) => {
        middlewares(request, reply, [withAuth], () => {
            const { asin } = request.params;
            ProductController.scrapFromAsin(asin)
                .then((res) => reply.code(200).send(res))
                .catch(err => reply.code(err.status).send(err.message));
        });
    });

    fastify.post(path + 'create', async (request, reply) => {
        middlewares(request, reply, [withAuth], () => {
            const { item } = request.body;
            ProductController.create(item, request.userId)
                .then((res) => reply.code(200).send(res))
                .catch(err => reply.code(err.status).send(err.message));
        });
    });

    fastify.get(path + 'find', async (request, reply) => {
        const { searchData } = request.query;
        ProductController.find(searchData)
            .then((res) => reply.code(200).send(res))
            .catch(err => reply.code(err.status).send(err.message));
    });
}

module.exports = productRoutes