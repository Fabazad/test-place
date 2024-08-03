import { HttpRequestError } from "./HttpRequestError.js";

export class BadRequestError extends HttpRequestError {
  constructor(public message: string = "Bad request") {
    super(400, message);
  }

  toString(): string {
    return this.message;
  }
}
