import { HttpRequestError } from "./HttpRequestError.js";

export class ServerRequestError extends HttpRequestError {
  constructor(public code: string, public message: string = "Internal Error") {
    super(500, code, message);
  }

  toString(): string {
    return this.message;
  }
}
