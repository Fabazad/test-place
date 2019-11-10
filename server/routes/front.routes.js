async function frontRoutes (fastify) {
    fastify.get('/login', async (req, reply) => {
        reply.sendFile("index.html");
    });
    fastify.get('/register', async (req, reply) => {
        reply.sendFile("index.html");
    });
}

module.exports = frontRoutes