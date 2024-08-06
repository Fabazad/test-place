/* eslint-disable no-nested-ternary */
import { Express, Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { HttpRequestError } from "./exceptions/HttpRequestError.js";

export const errorHandler = ({ app }: { app: Express }): void => {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpRequestError) {
      return res.status(err.status).send({ code: err.code, message: err.message });
    }
    console.error("Uncaught error", err);
    return res
      .status(500)
      .send({ code: "internal-error", message: err.message || "Internal error" });
  });
};
