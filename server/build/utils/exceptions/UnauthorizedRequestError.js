
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="edce5b4e-998b-57ae-869c-bdba81fedfa7")}catch(e){}}();
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
//# sourceMappingURL=UnauthorizedRequestError.js.map
//# debugId=edce5b4e-998b-57ae-869c-bdba81fedfa7
