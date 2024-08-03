import { Notification, NotificationData } from "../notification.entity";

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
