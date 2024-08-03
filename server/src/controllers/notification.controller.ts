const TestController = require("../controllers/test.controller");
import { getNotificationDAO } from "@/entities/Notification/dao/notification.dao.index";
import { Notification } from "@/entities/Notification/notification.entity";
import { GLOBAL_TEST_STATUSES } from "@/utils/constants";
import { CustomResponse } from "@/utils/CustomResponse";

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
        TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.REQUESTED),
        TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.PROCESSING),
        TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.COMPLETED),
        TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.CANCELLED),
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
