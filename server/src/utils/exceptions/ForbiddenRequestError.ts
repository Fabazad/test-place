import { HttpRequestError } from "./HttpRequestError.js";

export class ForbiddenRequestError extends HttpRequestError {
  constructor(public message: string = "Forbidden") {
    super(403, message);
  }

  toString(): string {
    return this.message;
  }
}
