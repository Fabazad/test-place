const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';

const withAuth = function (req, res, next) {
    const required = req.query.required !== false;

    const token =
        (req.body && req.body.token) ||
        (req.query && req.query.token) ||
        req.headers['x-access-token'] ||
        (req.cookies && req.cookies.token);
    if (!token && required) {
        res.status(401).send('Unauthorized');
    } else {
        jwt.verify(token, secret, function (err, decoded) {
            if (err && required) {
                res.status(401).send('Unauthorized');
            } else {
                req.userId = decoded.userId;
                req.role = decoded.role;
                req.amazonId = decoded.amazonId;
                next();
            }
        });
    }
};
module.exports = withAuth;