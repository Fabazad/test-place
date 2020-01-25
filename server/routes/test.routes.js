const TestController = require('../controllers/test.controller');
const withAuth = require('../middlewares/withAuth');
const express = require('express');
const router = express.Router();

router.post('/create', withAuth, async (request, reply) => {
    const {item} = request.body;
    TestController.create(item, request.userId)
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

module.exports = router;