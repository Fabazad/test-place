import { Notification, NotificationData } from "../notification.entity.js";

export type NotificationDAO = {
  getUserNotifications: (userId: string) => Promise<Array<Notification>>;
  setNotificationsViewed: (params: {
    userId: string;
    notificationsIds: Array<string>;
  }) => Promise<void>;
  createNotification: (params: {
    notificationData: NotificationData;
  }) => Promise<Notification>;
};
