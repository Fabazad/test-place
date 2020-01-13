const mongoose = require('mongoose');
require('dotenv').config();

async function dbConnection () {
    mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_LOCAL_URL, {useNewUrlParser: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("DB connected");
    });
}

// Wrapping a plugin function with fastify-plugin exposes the decorators,
// hooks, and middlewares declared inside the plugin to the parent scope.
module.exports = dbConnection;