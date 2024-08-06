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
