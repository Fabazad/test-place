
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b69d997a-7b4b-5e25-80dc-7183f196e28e")}catch(e){}}();
import { HttpRequestError } from "./HttpRequestError.js";
export class BadRequestError extends HttpRequestError {
    code;
    message;
    constructor(code, message = "Bad Request") {
        super(400, code, message);
        this.code = code;
        this.message = message;
    }
    toString() {
        return this.message;
    }
}
//# sourceMappingURL=BadRequestError.js.map
//# debugId=b69d997a-7b4b-5e25-80dc-7183f196e28e
