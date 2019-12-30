async function frontRoutes (fastify) {
    ["/", '/login', '/register', '/landing', '/my-profile', "/reset-password/*", "/email-validation/*", '/search*', '/dashboard/*', '/ad/*']
    .forEach(route => {
        fastify.get(route, async (req, reply) => {
            console.log(req.headers.host);
            reply.code(200).sendFile("index.html");
        });
    });
}

module.exports = frontRoutes;