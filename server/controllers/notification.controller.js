const constants = require("../helpers/constants");
const NotificationModel = require('../models/notification.model');
const ErrorResponses = require("../helpers/ErrorResponses");
const moment = require("moment");

const {} = constants;

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
            });
        } catch (err) {
            return ErrorResponses.mongoose(err);
        }

    }
}

module.exports = NotificationController;


