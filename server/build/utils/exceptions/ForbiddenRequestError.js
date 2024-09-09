
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d9817db1-fa41-53c7-840f-462f089d332f")}catch(e){}}();
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
//# sourceMappingURL=ForbiddenRequestError.js.map
//# debugId=d9817db1-fa41-53c7-840f-462f089d332f
