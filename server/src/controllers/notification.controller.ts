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
  private static async sendNotification(params: {
    notification: Notification;
    frontendUrl: string;
  }): Promise<CustomResponse<undefined, "user_not_found" | "email_not_sent">> {
    const { notification, frontendUrl } = params;

    const userDAO = getUserDAO();
    const emailClient = getEmailClient();

    const user = await userDAO.getUser({ userId: notification.user });

    if (!user) return { success: false, errorCode: "user_not_found" };

    const emailRes = await emailClient.sendNotificationMail({
      notification,
      to: { email: user.email, name: user.name, language: user.language },
      frontendUrl,
      userRole: user.roles[0],
    });

    if (!emailRes.success) return emailRes;

    return { success: true, data: undefined };
  }

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
    frontendUrl: string;
    noEmail?: boolean;
  }): Promise<CustomResponse<Notification, "user_not_found">> {
    const { notificationData, frontendUrl, noEmail } = params;

    const notificationDAO = getNotificationDAO();
    const monitoringClient = getMonitoringClient();

    const notification = await notificationDAO.createNotification({
      notificationData: notificationData,
    });

    if (noEmail) {
      return { success: true, data: notification };
    }

    const sentNotification = await this.sendNotification({
      notification,
      frontendUrl,
    });

    if (!sentNotification.success) {
      await monitoringClient.sendEvent({
        level: "error",
        eventName: "notification_not_sent",
        data: {
          message: `[${sentNotification.errorCode}] ${sentNotification.errorMessage}`,
        },
      });
    }

    return { success: true, data: notification };
  }
}
