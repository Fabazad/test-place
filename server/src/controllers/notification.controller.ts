import { getNotificationDAO } from "@/entities/Notification/dao/notification.dao.index.js";
import { Notification } from "@/entities/Notification/notification.entity.js";
import { getTestDAO } from "@/entities/Test/dao/test.dao.index.js";
import { GLOBAL_TEST_STATUSES } from "@/utils/constants.js";
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
    const notifications = await getNotificationDAO().getUserNotifications(userId);

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
}
