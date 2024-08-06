import { HttpRequestError } from "./HttpRequestError.js";
export class ConflictRequestError extends HttpRequestError {
    code;
    message;
    constructor(code, message = "Conflict") {
        super(409, code, message);
        this.code = code;
        this.message = message;
    }
    toString() {
        return this.message;
    }
}
