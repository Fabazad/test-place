import { getAuthManager } from "@/libs/AuthManager/index.js";
import { Role } from "@/utils/constants.js";
import { NextFunction, Request, Response } from "express";

export const withAuth =
  (role: Role | null = null) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (role === null) return next();

    const authManager = getAuthManager();

    if (authManager.checkRole(role, req.decoded)) {
      return next();
    }
    return res.status(401).send("Unauthorized");
  };
