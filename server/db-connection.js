const mongoose = require('mongoose');
const fastifyPlugin = require('fastify-plugin');
require('dotenv').config();

async function dbConnector (fastify) {
    mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_LOCAL_URL, {useNewUrlParser: true});
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("DB connected");
    });
    fastify.decorate('mongo', db);
}

// Wrapping a plugin function with fastify-plugin exposes the decorators,
// hooks, and middlewares declared inside the plugin to the parent scope.
module.exports = fastifyPlugin(dbConnector)