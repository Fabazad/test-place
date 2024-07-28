import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { configs } from "./configs";
import { getDatabaseConnection } from "./databaseConnection";
import { decode } from "./middlewares/decode";
const routes = require("./routes");

const app = express();

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  return res.status(500).send(err.message);
});

app.use(cors());

app.use(decode, function (req, res, next) {
  console.log(req.method + " : " + req.url + " [" + Date.now() + "]");
  next();
});

app.use(express.static(path.join(__dirname, "/build")));

// Run the server!
const start = async () => {
  const port = configs.PORT || 5001;
  await getDatabaseConnection().connect();
  routes(app);

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });

  app.use(function (req, res, next) {
    console.log(req.url + " : " + Date.now());
    next();
  });

  app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
  });
};

start();
