async function frontRoutes (fastify) {
    ["/", '/login', '/register', '/landing', '/profile/*', "/reset-password/*", "/email-validation/*"]
    .forEach(route => {
        fastify.get(route, async (req, reply) => {
            reply.code(200).sendFile("index.html");
        });
    });
}

module.exports = frontRoutes