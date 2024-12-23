import { generateMongooseSchemaFromZod } from "@/utils/generateMongooseSchemaFromZod/index.js";
import { savedDataSchema } from "@/utils/savedDataSchema.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import dayjs from "dayjs";
import mongoose from "mongoose";
import z from "zod";
import { notificationDataSchema } from "../notification.entity.js";
import { NotificationDAO } from "./notification.dao.type.js";

const notificationMongooseSchema = new mongoose.Schema(
  generateMongooseSchemaFromZod(notificationDataSchema),
  { timestamps: true }
);

notificationMongooseSchema.index({ user: 1, viewDate: -1, createdAt: -1 });

const notificationSchema = notificationDataSchema.extend(savedDataSchema);
type Notification = z.infer<typeof notificationSchema>;

const notificationModel = mongoose.model<Notification>(
  "Notification",
  notificationMongooseSchema
);

export const createNotificationDAO = (): NotificationDAO => {
  return {
    getUserNotifications: async (userId) => {
      const res = await notificationModel
        .find(
          {
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
          },
          {},
          { sort: { createdAt: -1 }, limit: 20 }
        )
        .lean();

      return JSON.parse(JSON.stringify(res));
    },
    setNotificationsViewed: async ({ userId, notificationsIds }) => {
      await notificationModel.updateMany(
        {
          _id: { $in: notificationsIds },
          user: userId,
        },
        {
          $set: {
            viewDate: new Date(),
          },
        }
      );
    },
    createNotification: async ({ notificationData }) => {
      const notification = await notificationModel.create(notificationData);
      return JSON.parse(JSON.stringify(notification.toJSON()));
    },
  };
};

export const getNotificationDAO = createSingletonGetter(createNotificationDAO);
