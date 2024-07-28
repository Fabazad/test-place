const decode = require("./middlewares/decode");
const express = require("express");
const app = express();
const dbConnection = require("./db-connection");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const httpsRedirect = require("express-https-redirect");
const { PORT } = require("./configs");

if (process.env.NODE_ENV === "production") {
  app.use("/", httpsRedirect(true));
}

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use(cors());

app.use(decode, function (req, res, next) {
  console.log(req.method + " : " + req.url + " [" + Date.now() + "]");
  next();
});

app.use(express.static(path.join(__dirname, "/build")));

const routes = require("./routes");
routes(app);
dbConnection();

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(function (req, res, next) {
  console.log(req.url + " : " + Date.now());
  next();
});

// Run the server!
const start = () => {
  const port = PORT || 5001;
  app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
  });
};

start();
