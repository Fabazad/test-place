const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('useFindAndModify', false);
async function dbConnection () {
    mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_LOCAL_URL, {useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("DB connected"))
        .catch(err => console.log(err));
}

module.exports = dbConnection;