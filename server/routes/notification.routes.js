const NotificationController = require('../controllers/notification.controller');
const withAuth = require('../middlewares/withAuth');
const express = require('express');
const router = express.Router();

router.get('/user-notifications', withAuth(), async (request, reply) => {
    NotificationController.getUserNotifications(request.decoded.userId)
        .then((res) => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/set-notifications-viewed', withAuth(), async (request, reply) => {
    const {notificationsIds} = request.body;
    NotificationController.setNotificationsViewed(request.decoded.userId, notificationsIds)
        .then((res) => reply.send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

module.exports = router;