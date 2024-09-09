
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="01d9c93a-e708-5d0b-846e-fb5e3e606aa6")}catch(e){}}();
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
//# sourceMappingURL=NotFoundRequestError.js.map
//# debugId=01d9c93a-e708-5d0b-846e-fb5e3e606aa6
