
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="72647b63-546c-57ee-937e-67b521dd4add")}catch(e){}}();
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// Get the filename of the current module
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current module
const __dirname = dirname(__filename);
const router = express.Router();
[
    "*",
    "login",
    "register",
    "landing",
    "my-profile",
    "reset-password/*",
    "email-validation/*",
    "search*",
    "dashboard/*",
    "ad/*",
].forEach((route) => {
    router.get(route, async (req, res) => {
        res.sendFile(path.join(__dirname, "../../../client/build/index.html"));
    });
});
export default router;
//# sourceMappingURL=front.routes.js.map
//# debugId=72647b63-546c-57ee-937e-67b521dd4add
