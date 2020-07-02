const NotificationModel = require('../models/notification.model');
const ErrorResponses = require("../helpers/ErrorResponses");
const moment = require("moment");
const TestController = require('../controllers/test.controller');
const constants = require('../helpers/constants');
const {GLOBAL_TEST_STATUSES} = constants;

class NotificationController {

    static async getUserNotifications(userId) {
        try {
            const notifications = await NotificationModel.find({
                user: userId,
                $or: [{
                    viewDate: null
                }, {
                    viewDate: {
                        $gte: moment().subtract(1, 'day').toDate()
                    }
                }]
            }).sort({createdAt: -1}).limit(20);

            const hasNewNotifications = notifications.some(notification => notification.viewDate === null);

            if (hasNewNotifications) {
                const [requestedTestsCount, processingTestsCount, completedTestsCount, cancelledTestsCount] = await Promise.all([
                    TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.REQUESTED),
                    TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.PROCESSING),
                    TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.COMPLETED),
                    TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.CANCELLED)
                ]);

                return {notifications, requestedTestsCount, processingTestsCount, completedTestsCount, cancelledTestsCount};
            }

            return {notifications};

        } catch (err) {
            return ErrorResponses.mongoose(err);
        }

    }

    static async setNotificationsViewed(userId, notificationsIds) {
        try {
            return await NotificationModel.updateMany({
                _id: {$in: notificationsIds}
            }, {
                $set: {
                    viewDate: new Date()
                }
            });
        } catch (err) {
            return ErrorResponses.mongoose(err);
        }
    }
}

module.exports = NotificationController;


