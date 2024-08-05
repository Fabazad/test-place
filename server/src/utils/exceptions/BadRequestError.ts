import { HttpRequestError } from "./HttpRequestError.js";

export class BadRequestError extends HttpRequestError {
  constructor(public code: string, public message: string = "Bad Request") {
    super(400, code, message);
  }

  toString(): string {
    return this.message;
  }
}
