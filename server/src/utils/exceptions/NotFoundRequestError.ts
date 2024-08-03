import { HttpRequestError } from "./HttpRequestError.js";

export class NotFoundRequestError extends HttpRequestError {
  constructor(public message: string = "Not found") {
    super(404, message);
  }

  toString(): string {
    return this.message;
  }
}
