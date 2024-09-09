
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="53012e9c-92dd-5e73-991c-c0a3d7f0e908")}catch(e){}}();
import { generateMongooseSchemaFromZod } from "../../../utils/generateMongooseSchemaFromZod/index.js";
import { savedDataSchema } from "../../../utils/savedDataSchema.js";
import { createSingletonGetter } from "../../../utils/singleton.js";
import dayjs from "dayjs";
import mongoose from "mongoose";
import { notificationDataSchema } from "../notification.entity.js";
const notificationMongooseSchema = new mongoose.Schema(generateMongooseSchemaFromZod(notificationDataSchema), { timestamps: true });
const notificationSchema = notificationDataSchema.extend(savedDataSchema);
const notificationModel = mongoose.model("Notification", notificationMongooseSchema);
export const createNotificationDAO = () => {
    return {
        getUserNotifications: async (userId) => {
            const res = await notificationModel
                .find({
                user: userId,
                $or: [
                    {
                        viewDate: null,
                    },
                    {
                        viewDate: {
                            $gte: dayjs().subtract(1, "day").toDate(),
                        },
                    },
                ],
            }, {}, { sort: { createdAt: -1 }, limit: 20 })
                .lean();
            return JSON.parse(JSON.stringify(res));
        },
        setNotificationsViewed: async ({ userId, notificationsIds }) => {
            await notificationModel.updateMany({
                _id: { $in: notificationsIds },
                user: userId,
            }, {
                $set: {
                    viewDate: new Date(),
                },
            });
        },
        createNotification: async ({ notificationData }) => {
            const notification = await notificationModel.create(notificationData);
            return JSON.parse(JSON.stringify(notification.toJSON()));
        },
    };
};
export const getNotificationDAO = createSingletonGetter(createNotificationDAO);
//# sourceMappingURL=notification.dao.index.js.map
//# debugId=53012e9c-92dd-5e73-991c-c0a3d7f0e908
