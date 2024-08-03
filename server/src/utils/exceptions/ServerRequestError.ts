import { HttpRequestError } from "./HttpRequestError.js";

export class ServerRequestError extends HttpRequestError {
  constructor(public message: string = "Internal Error") {
    super(500, message);
  }

  toString(): string {
    return this.message;
  }
}
