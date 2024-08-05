import { getEmailClient } from "@/libs/EmailClient/index.js";
import { generateMongooseSchemaFromZod } from "@/utils/generateMongooseSchemaFromZod/index.js";
import { savedDataSchema } from "@/utils/savedDataSchema.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import dayjs from "dayjs";
import mongoose from "mongoose";
import z from "zod";
import { notificationDataSchema } from "../notification.entity.js";
import { NotificationDAO } from "./notification.dao.type.js";

export const createNotificationDAO = (): NotificationDAO => {
  const notificationMongooseSchema = new mongoose.Schema(
    generateMongooseSchemaFromZod(notificationDataSchema),
    { timestamps: true }
  );

  const notificationSchema = notificationDataSchema.extend(savedDataSchema);
  type Notification = z.infer<typeof notificationSchema>;

  notificationMongooseSchema.post("save", async (doc: Notification) => {
    await getEmailClient().sendNotificationMail({ notification: doc });
  });

  const notificationModel = mongoose.model<Notification>(
    "Notification",
    notificationMongooseSchema
  );

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
          { sort: { createdAt: -1 }, limit: 20, lean: true }
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
