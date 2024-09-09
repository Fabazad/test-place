
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="3de4a38f-a85a-58b0-9aaa-283f12cd0b44")}catch(e){}}();
import { HttpRequestError } from "./exceptions/HttpRequestError.js";
export const errorHandler = ({ app }) => {
    app.use((err, req, res, next) => {
        if (err instanceof HttpRequestError) {
            return res.status(err.status).send({ code: err.code, message: err.message });
        }
        console.error("Uncaught error", err);
        return res
            .status(500)
            .send({ code: "internal-error", message: err.message || "Internal error" });
    });
};
//# sourceMappingURL=errorHandler.js.map
//# debugId=3de4a38f-a85a-58b0-9aaa-283f12cd0b44
