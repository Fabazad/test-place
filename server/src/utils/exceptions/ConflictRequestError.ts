import { HttpRequestError } from "./HttpRequestError.js";

export class ConflictRequestError extends HttpRequestError {
  constructor(public message: string = "Conflict") {
    super(409, message);
  }

  toString(): string {
    return this.message;
  }
}
