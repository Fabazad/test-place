const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('useFindAndModify', false);
async function dbConnection () {
    mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_LOCAL_URL, {useNewUrlParser: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("DB connected");
    });
}

module.exports = dbConnection;