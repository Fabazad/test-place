const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';

const withAuth = function(req, res) {
  const token =
    (req.body && req.body.token) ||
    (req.query && req.query.token) ||
    req.headers['x-access-token'] ||
    (req.cookies && req.cookies.token);
  if (!token) {
    res.status(401).send('Unauthorized');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized');
      } else {
        req.email = decoded.email;
        return {request: req, reply: res}
      }
    });
  }
}
module.exports = withAuth;