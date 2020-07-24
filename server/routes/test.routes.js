const TestController = require('../controllers/test.controller');
const withAuth = require('../middlewares/withAuth');
const express = require('express');
const router = express.Router();
const {ROLES} = require("../helpers/constants");

router.post('/create', withAuth(ROLES.TESTER), async (request, reply) => {
    const {item} = request.body;
    TestController.create(item, request.decoded.userId, request.decoded.amazonId)
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.get('/statuses', async (request, reply) => {
    TestController.getStatuses()
        .then((res) => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.get('/find', withAuth(), async (request, reply) => {
    const {searchData} = request.query;
    TestController.find(request.decoded.userId, JSON.parse(searchData))
        .then((res) => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/updateStatus', async (request, reply) => {
    const {testId, status, params} = request.body;
    TestController.updateStatus(request.decoded.userId, testId, status, params)
        .then((res) => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.get('/:testId', withAuth(), async (req, res) => {
    const {testId} = req.params;
    TestController.getTest(testId, req.decoded.userId, req.decoded.roles)
        .then(test => res.send(test))
        .catch(err => res.status(err.status).send(err.message));
});

module.exports = router;