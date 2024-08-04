import { getAuthManager } from "@/libs/AuthManager/index.js";
import { NextFunction, Request, Response } from "express";

export const decode = (req: Request, res: Response, next: NextFunction) => {
  const token =
    (req.body && req.body.token) ||
    (req.query && req.query.token) ||
    req.headers["x-access-token"] ||
    (req.cookies && req.cookies.token);
  if (typeof token !== "string") {
    return next();
  }
  try {
    const authManager = getAuthManager();
    const decoded = authManager.decodeUser(token);
    if (decoded) {
      req.decoded = decoded;
    }
    return next();
  } catch (err) {
    return next();
  }
};
