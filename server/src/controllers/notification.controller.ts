import { getNotificationDAO } from "@/entities/Notification/dao/notification.dao.index.js";
import {
  Notification,
  NotificationData,
} from "@/entities/Notification/notification.entity.js";
import { getTestDAO } from "@/entities/Test/dao/test.dao.index.js";
import { GLOBAL_TEST_STATUSES } from "@/entities/Test/test.constants.js";
import { getUserDAO } from "@/entities/User/dao/user.dao.index.js";
import { getEmailClient } from "@/libs/EmailClient/index.js";
import { getMonitoringClient } from "@/libs/MonitoringClient/index.js";
import { CustomResponse } from "@/utils/CustomResponse.js";

export class NotificationController {
  static async getUserNotifications(userId: string): Promise<
    CustomResponse<
      | { notifications: Array<Notification> }
      | {
          notifications: Array<Notification>;
          requestedTestsCount: number;
          processingTestsCount: number;
          completedTestsCount: number;
          cancelledTestsCount: number;
        }
    >
  > {
    const testDAO = getTestDAO();
    const notificationDAO = getNotificationDAO();

    const notifications = await notificationDAO.getUserNotifications(userId);

    const hasNewNotifications = notifications.some(
      (notification) => notification.viewDate === null
    );

    if (hasNewNotifications) {
      const [
        requestedTestsCount,
        processingTestsCount,
        completedTestsCount,
        cancelledTestsCount,
      ] = await Promise.all([
        testDAO.countTestWithStatues({
          userId,
          statuses: GLOBAL_TEST_STATUSES.REQUESTED,
        }),
        testDAO.countTestWithStatues({
          userId,
          statuses: GLOBAL_TEST_STATUSES.PROCESSING,
        }),
        testDAO.countTestWithStatues({
          userId,
          statuses: GLOBAL_TEST_STATUSES.COMPLETED,
        }),
        testDAO.countTestWithStatues({
          userId,
          statuses: GLOBAL_TEST_STATUSES.CANCELLED,
        }),
      ]);

      return {
        success: true,
        data: {
          notifications,
          requestedTestsCount,
          processingTestsCount,
          completedTestsCount,
          cancelledTestsCount,
        },
      };
    }

    return { success: true, data: { notifications } };
  }

  static async setNotificationsViewed(
    userId: string,
    notificationsIds: Array<string>
  ): Promise<CustomResponse<undefined>> {
    await getNotificationDAO().setNotificationsViewed({ userId, notificationsIds });
    return { success: true, data: undefined };
  }

  static async createNotification(params: {
    notificationData: NotificationData;
  }): Promise<CustomResponse<Notification, "user_not_found">> {
    const { notificationData } = params;

    const notificationDAO = getNotificationDAO();
    const userDAO = getUserDAO();
    const emailClient = getEmailClient();
    const monitoringClient = getMonitoringClient();

    const notification = await notificationDAO.createNotification({
      notificationData: notificationData,
    });

    const user = await userDAO.getUser({ userId: notificationData.user });

    if (!user) return { success: false, errorCode: "user_not_found" };

    const emailRes = await emailClient.sendNotificationMail({
      notification,
      to: { email: user.email, name: user.name, language: user.language },
    });

    if (!emailRes.success)
      await monitoringClient.sendEvent({
        level: "error",
        eventName: "notification_email_not_sent",
        data: { message: `[${emailRes.errorCode}] ${emailRes.errorMessage}` },
      });

    return { success: true, data: notification };
  }
}
