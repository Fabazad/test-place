import { HttpRequestError } from "./HttpRequestError.js";

export class NotFoundRequestError extends HttpRequestError {
  constructor(public code: string, public message: string = "Not Found") {
    super(404, code, message);
  }

  toString(): string {
    return this.message;
  }
}
