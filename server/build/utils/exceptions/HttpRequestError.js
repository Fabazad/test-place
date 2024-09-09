
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2620dd0d-c1ab-53c3-b2d8-1c54593fba71")}catch(e){}}();
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
//# sourceMappingURL=HttpRequestError.js.map
//# debugId=2620dd0d-c1ab-53c3-b2d8-1c54593fba71
