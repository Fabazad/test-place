
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="05fc0275-fcf4-5da7-a32c-0b85b8372b94")}catch(e){}}();
import { getAuthManager } from "../libs/AuthManager/index.js";
export const withAuth = (role = null) => (req, res, next) => {
    if (role === null)
        return next();
    const authManager = getAuthManager();
    if (authManager.checkRole(role, req.decoded)) {
        return next();
    }
    return res.status(401).send("Unauthorized");
};
//# sourceMappingURL=withAuth.js.map
//# debugId=05fc0275-fcf4-5da7-a32c-0b85b8372b94
