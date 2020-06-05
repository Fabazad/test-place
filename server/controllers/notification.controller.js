const NotificationModel = require('../models/notification.model');
const ErrorResponses = require("../helpers/ErrorResponses");
const moment = require("moment");

class NotificationController {

    static async getUserNotifications(userId) {
        try {
            return await NotificationModel.find({
                user: userId,
                $or: [{
                    viewDate: null
                }, {
                    viewDate: {
                        $gte: moment().subtract(1, 'day').toDate()
                    }
                }]
            }).sort({createdAt: -1}).limit(20);
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


