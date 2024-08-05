import { HttpRequestError } from "./HttpRequestError.js";

export class UnauthorizedRequestError extends HttpRequestError {
  constructor(public code: string, public message: string = "Unauthorized") {
    super(401, code, message);
  }

  toString(): string {
    return this.message;
  }
}
