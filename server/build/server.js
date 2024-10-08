
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c4986a65-6c0f-58e5-b908-ce2094b410ee")}catch(e){}}();
import { getMonitoringClient } from "./libs/MonitoringClient/index.js";
const monitoringClient = getMonitoringClient();
monitoringClient.init();
import routes from "./routes/index.js";
import cors from "cors";
import dayjs from "dayjs";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { configs } from "./configs.js";
import { getDatabaseConnection } from "./databaseConnection/index.js";
import { decode } from "./middlewares/decode.js";
import { errorHandler } from "./utils/errorHandler.js";
// Get the filename of the current module
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current module
const __dirname = dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(decode, function (req, res, next) {
    console.log(`${dayjs().toISOString()} [${req.method}]${req.url}`);
    next();
});
app.use(express.static(path.join(__dirname, "../../client/build")));
// Run the server!
const start = async () => {
    const port = configs.PORT || 5001;
    await getDatabaseConnection().connect();
    app.use("/", routes);
    app.get("/*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
    });
    monitoringClient.setupErrorHandler({ app });
    errorHandler({ app });
    app.listen(port, function () {
        console.log(`Example app listening on port ${port}!`);
    });
};
start();
//# sourceMappingURL=server.js.map
//# debugId=c4986a65-6c0f-58e5-b908-ce2094b410ee
