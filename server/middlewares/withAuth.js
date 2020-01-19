const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';
const UserModel = require('../models/user.model');

const withAuth = function (req, res, next) {
    const required = req.query.required !== false;

    const token =
        (req.body && req.body.token) ||
        (req.query && req.query.token) ||
        req.headers['x-access-token'] ||
        (req.cookies && req.cookies.token);
    if ((!token ||token === "null") && required) {
        res.status(401).send('Unauthorized');
    } else {
        jwt.verify(token, secret, function (err, decoded) {
            if (err && required) {
                res.status(401).send('Unauthorized');
            } else {
                UserModel.findById(decoded.userId).then(user => {
                    if (!user && required) {
                        res.status(401).send('Unauthorized');
                    }
                    req.userId = user.id;
                    req.amazonId = user.amazonId;
                    next();
                }).catch(err => res.status(500).send('Internal Error'));
            }
        });
    }
};
module.exports = withAuth;