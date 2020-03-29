const withAuth = (req, res, next) => {
    if (req.decoded) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};
module.exports = withAuth;