import { HttpRequestError } from "./HttpRequestError.js";

export class ForbiddenRequestError extends HttpRequestError {
  constructor(public code: string, public message: string = "Forbidden") {
    super(403, code, message);
  }

  toString(): string {
    return this.message;
  }
}
