import { HttpRequestError } from "./HttpRequestError.js";

export class ConflictRequestError extends HttpRequestError {
  constructor(public code: string, public message: string = "Conflict") {
    super(409, code, message);
  }

  toString(): string {
    return this.message;
  }
}
