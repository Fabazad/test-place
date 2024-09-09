
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6232aa27-874a-5ac7-bd36-c28dbe79a383")}catch(e){}}();
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
//# sourceMappingURL=ServerRequestError.js.map
//# debugId=6232aa27-874a-5ac7-bd36-c28dbe79a383
