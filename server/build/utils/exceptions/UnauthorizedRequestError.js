import { HttpRequestError } from "./HttpRequestError.js";
export class UnauthorizedRequestError extends HttpRequestError {
    code;
    message;
    constructor(code, message = "Unauthorized") {
        super(401, code, message);
        this.code = code;
        this.message = message;
    }
    toString() {
        return this.message;
    }
}
