import { HttpRequestError } from "./HttpRequestError.js";

export class UnauthorizedRequestError extends HttpRequestError {
  constructor(public message: string = "Unauthorized") {
    super(401, message);
  }

  toString(): string {
    return this.message;
  }
}
