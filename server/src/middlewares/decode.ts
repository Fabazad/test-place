import { configs } from "@/configs";
import { isDecodedUser } from "@/utils/DecodedUser.type";
import { NextFunction, Request, Response } from "express";
import {} from "jsonwebtoken";
import jwtSimple from "jwt-simple";

if (!configs.JWT_KEY) {
  throw new Error("JWT_KEY is missing in configs");
}

const secret = configs.JWT_KEY;

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
    const decoded = jwtSimple.decode(token, secret);
    if (isDecodedUser(decoded)) {
      req.decoded = decoded;
    }
    return next();
  } catch (err) {
    return next();
  }
};
