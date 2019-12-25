async function frontRoutes (fastify) {
    ["/", '/login', '/register', '/landing', '/my-profile', "/reset-password/*", "/email-validation/*", '/search/*', '/dashboard/*']
    .forEach(route => {
        fastify.get(route, async (req, reply) => {
            reply.code(200).sendFile("index.html");
        });
    });
}

module.exports = frontRoutes