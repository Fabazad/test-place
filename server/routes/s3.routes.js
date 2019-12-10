const S3Controller = require('../controllers/s3.controller')

async function productRoutes (fastify) {
    const path = "/api/s3/";

    fastify.post(path + 'sign-s3', async (request, reply) => {
        const { fileName, fileType } = request.body;
        S3Controller.signS3(fileName, fileType)
            .then((res) => reply.code(200).send(res))
            .catch(err => reply.code(err.status).send(err.message));
    });
}

module.exports = productRoutes