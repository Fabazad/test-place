import { Role } from "@/utils/constants.js";
import { NextFunction, Request, Response } from "express";

export const withAuth =
  (role: Role | null = null) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (
      req.decoded &&
      (!role ||
        req.decoded.roles.includes(role) ||
        req.decoded.roles.includes(Role.ADMIN))
    ) {
      return next();
    }
    return res.status(401).send("Unauthorized");
  };
