
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="167c75b8-9054-53fe-b4bf-85686a2a035b")}catch(e){}}();
import { getNotificationDAO } from "../entities/Notification/dao/notification.dao.index.js";
import { getTestDAO } from "../entities/Test/dao/test.dao.index.js";
import { GLOBAL_TEST_STATUSES } from "../entities/Test/test.constants.js";
import { getUserDAO } from "../entities/User/dao/user.dao.index.js";
import { getEmailClient } from "../libs/EmailClient/index.js";
import { getMonitoringClient } from "../libs/MonitoringClient/index.js";
export class NotificationController {
    static async sendNotification(params) {
        const { notification, frontendUrl } = params;
        const userDAO = getUserDAO();
        const emailClient = getEmailClient();
        const user = await userDAO.getUser({ userId: notification.user });
        if (!user)
            return { success: false, errorCode: "user_not_found" };
        const emailRes = await emailClient.sendNotificationMail({
            notification,
            to: { email: user.email, name: user.name, language: user.language },
            frontendUrl,
            userRole: user.roles[0],
        });
        if (!emailRes.success)
            return emailRes;
        return { success: true, data: undefined };
    }
    static async getUserNotifications(userId) {
        const testDAO = getTestDAO();
        const notificationDAO = getNotificationDAO();
        const notifications = await notificationDAO.getUserNotifications(userId);
        const hasNewNotifications = notifications.some((notification) => notification.viewDate === null);
        if (hasNewNotifications) {
            const [requestedTestsCount, processingTestsCount, completedTestsCount, cancelledTestsCount,] = await Promise.all([
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
    static async setNotificationsViewed(userId, notificationsIds) {
        await getNotificationDAO().setNotificationsViewed({ userId, notificationsIds });
        return { success: true, data: undefined };
    }
    static async createNotification(params) {
        const { notificationData, frontendUrl } = params;
        const notificationDAO = getNotificationDAO();
        const monitoringClient = getMonitoringClient();
        const notification = await notificationDAO.createNotification({
            notificationData: notificationData,
        });
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
//# sourceMappingURL=notification.controller.js.map
//# debugId=167c75b8-9054-53fe-b4bf-85686a2a035b
