export class HttpRequestError extends Error {
    status;
    code;
    message;
    constructor(status = 500, code, message = "Internal Error") {
        super();
        this.status = status;
        this.code = code;
        this.message = message;
    }
    toString() {
        return this.message;
    }
}
