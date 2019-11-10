const constants = require('./helpers/constants');
const fastify = require('fastify')({ logger: true });
const path = require('path');
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '/../frontend/build/'),
  prefix: "/"
});

fastify.register(require('fastify-cors'), { 
  origin: process.env.PROD ? constants.FRONTEND_URL : constants.FRONTEND_LOCAL_URL,
  credentials: true
});

fastify.register(require('./routes'));
fastify.register(require('./db-connection'));

// Run the server!
const start = () => {
  fastify.listen(process.env.PORT || 5000, '0.0.0.0')
  .catch (err => {
    fastify.log.error(err)
    process.exit(1)
  });
}
start()