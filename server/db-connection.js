const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("useFindAndModify", false);
async function dbConnection() {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_LOCAL_URL ||
    "mongodb://127.0.0.1:27017/test-place";
  console.log(uri);
  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err));
}

module.exports = dbConnection;
