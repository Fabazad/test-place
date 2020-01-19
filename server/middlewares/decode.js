const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';

const decode = function (req, res, next) {
    const token =
        (req.body && req.body.token) ||
        (req.query && req.query.token) ||
        req.headers['x-access-token'] ||
        (req.cookies && req.cookies.token);
    if (!token || token === "null") {
        req.decoded = null;
        next();
    } else {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized');
            } else {
                req.decoded = { userId: decoded.userId };
                next();
            }
        });
    }
};
module.exports = decode;