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
