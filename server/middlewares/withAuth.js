const {ROLES} = require("../helpers/constants");

const withAuth = (role = null) => (req, res, next) => {
    if (req.decoded && (!role || req.decoded.roles.includes(role) || req.decoded.roles.includes(ROLES.ADMIN))) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};
module.exports = withAuth;