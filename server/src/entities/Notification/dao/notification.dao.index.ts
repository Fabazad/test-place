import { getEmailClient } from "@/libs/EmailClient";
import { generateMongooseSchemaFromZod } from "@/utils/generateMongooseSchemaFromZod";
import { savedDataSchema } from "@/utils/savedDataSchema";
import { createSingletonGetter } from "@/utils/singleton";
import moment from "moment";
import mongoose from "mongoose";
import z from "zod";
import { NotificationData, notificationDataSchema } from "../notification.entity";
import { NotificationDAO } from "./notification.dao.type";

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

  const notificationModel = mongoose.model<NotificationData>(
    "Notification",
    notificationMongooseSchema
  );

  return {
    getUserNotifications: async (userId) => {
      const res = await notificationModel.find(
        {
          user: userId,
          $or: [
            {
              viewDate: null,
            },
            {
              viewDate: {
                $gte: moment().subtract(1, "day").toDate(),
              },
            },
          ],
        },
        { sort: { createdAt: -1 }, limit: 20, lean: true }
      );
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
  };
};

export const getNotificationDAO = createSingletonGetter(createNotificationDAO);
