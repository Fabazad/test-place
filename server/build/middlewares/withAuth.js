
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ff42f7e5-ca86-5dc6-9a5e-602981316d44")}catch(e){}}();
import { getAuthManager } from "../libs/AuthManager/index.js";
export const withAuth = (role = null) => (req, res, next) => {
    if (!req.decoded)
        return res.status(401).send("Unauthorized");
    if (role === null)
        return next();
    const authManager = getAuthManager();
    if (authManager.checkRole(role, req.decoded)) {
        return next();
    }
    return res.status(401).send("Unauthorized");
};
//# sourceMappingURL=withAuth.js.map
//# debugId=ff42f7e5-ca86-5dc6-9a5e-602981316d44
