import { HttpRequestError } from "./HttpRequestError.js";
export class ForbiddenRequestError extends HttpRequestError {
    code;
    message;
    constructor(code, message = "Forbidden") {
        super(403, code, message);
        this.code = code;
        this.message = message;
    }
    toString() {
        return this.message;
    }
}
