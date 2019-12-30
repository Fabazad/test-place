async function frontRoutes(fastify) {
    ["/", '/login', '/register', '/landing', '/my-profile', "/reset-password/*", "/email-validation/*", '/search*', '/dashboard/*', '/ad/*']
        .forEach(route => {
            fastify.get(route, async (req, reply) => {
                const host = req.headers.host;
                if ( req.headers.encrypted || host.match(/localhost/)) {
                    reply.code(200).sendFile("index.html");
                } else {

                    reply.request.headers.encrypted = true;
                    reply.redirect('https://'+ host + req.raw.url);
                }
            });
        });
}

module.exports = frontRoutes;