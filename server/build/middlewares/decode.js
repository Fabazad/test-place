
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="4a058696-f841-5605-aedb-aac60c21bc8b")}catch(e){}}();
import { getAuthManager } from "../libs/AuthManager/index.js";
export const decode = (req, res, next) => {
    const token = (req.body && req.body.token) ||
        (req.query && req.query.token) ||
        req.headers["x-access-token"] ||
        (req.cookies && req.cookies.token);
    if (typeof token !== "string") {
        return next();
    }
    try {
        const authManager = getAuthManager();
        const decoded = authManager.decodeUser(token);
        if (decoded) {
            req.decoded = decoded;
        }
        return next();
    }
    catch (err) {
        return next();
    }
};
//# sourceMappingURL=decode.js.map
//# debugId=4a058696-f841-5605-aedb-aac60c21bc8b
