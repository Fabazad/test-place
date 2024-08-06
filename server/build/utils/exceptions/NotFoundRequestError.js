import { HttpRequestError } from "./HttpRequestError.js";
export class NotFoundRequestError extends HttpRequestError {
    code;
    message;
    constructor(code, message = "Not Found") {
        super(404, code, message);
        this.code = code;
        this.message = message;
    }
    toString() {
        return this.message;
    }
}
