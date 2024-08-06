import { HttpRequestError } from "./HttpRequestError.js";
export class ServerRequestError extends HttpRequestError {
    code;
    message;
    constructor(code, message = "Internal Error") {
        super(500, code, message);
        this.code = code;
        this.message = message;
    }
    toString() {
        return this.message;
    }
}
