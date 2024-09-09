
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2e88d312-33a3-59e5-a74d-3067a1b7aca1")}catch(e){}}();
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
//# sourceMappingURL=ConflictRequestError.js.map
//# debugId=2e88d312-33a3-59e5-a74d-3067a1b7aca1
