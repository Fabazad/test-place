const TestController = require('../controllers/test.controller');
const withAuth = require('../middlewares/withAuth');
const express = require('express');
const router = express.Router();

router.post('/create', withAuth, async (request, reply) => {
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

router.get('/find', withAuth, async (request, reply) => {
    const { searchData } = request.query;
    TestController.find(request.decoded.userId, JSON.parse(searchData))
        .then((res) => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/cancelRequest', withAuth, async (request, reply) => {
    const { testId, cancelReason } = request.body;
    TestController.cancelRequest(request.decoded.userId, testId, cancelReason)
        .then((res) => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/declineRequest', withAuth, async (request, reply) => {
    const { testId, declineReason } = request.body;
    TestController.declineRequest(request.decoded.userId, testId, declineReason)
        .then((res) => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/acceptRequest', withAuth, async (request, reply) => {
    const { testId, sellerMessage } = request.body;
    TestController.acceptRequest(request.decoded.userId, testId, sellerMessage)
        .then((res) => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

module.exports = router;