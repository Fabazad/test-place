import express from "express";
import path from "path";

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

module.exports = router;
