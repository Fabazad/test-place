async function frontRoutes (fastify) {
    fastify.get('/', async (req, reply) => {
        console.log("test");
        reply.code(200).sendFile("index.html");
    });
    fastify.get('/login', async (req, reply) => {
        console.log("test");
        reply.sendFile("index.html");
    });
    fastify.get('/register', async (req, reply) => {
        reply.sendFile("index.html");
    });
    fastify.get('/landing', async (req, reply) => {
        reply.sendFile("index.html");
    });
    fastify.get('/profile', async (req, reply) => {
        reply.sendFile("index.html");
    });
}

module.exports = frontRoutes