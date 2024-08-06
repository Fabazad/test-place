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
