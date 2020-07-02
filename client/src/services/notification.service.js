import BaseService from "./base.service.js";
import axios from "axios";
import {Subject} from "rxjs";
import userServices from "./user.services";
import testServices from "./test.services";

class NotificationServices extends BaseService {
    constructor() {
        super('/notification');
        this.notifications = null;
        this.notificationsSubject = new Subject();
        this.refreshUserNotifications = this.refreshUserNotifications.bind(this);
    }

    getUserNotifications() {
        return this.notifications;
    }

    async refreshUserNotifications() {
        if (userServices.isAuth()) {
            this.notifications = null;
            const notificationsResponse = await axios.get(this.baseURL + "/user-notifications").then(this.serviceResolve);
            this.notifications = notificationsResponse.notifications;
            if ('requestedTestsCount' in notificationsResponse
                || 'processingTestsCount' in notificationsResponse
                || 'completedTestsCount' in notificationsResponse
                || 'cancelledTestsCount' in notificationsResponse
            ) {
                testServices.testGlobalStatusesCountSubject.next(notificationsResponse);
            }
            this.notificationsSubject.next();
        }
    }

    async setNotificationsViewed(notificationsIds) {
        await this.post('set-notifications-viewed', { notificationsIds });
        this.refreshUserNotifications();
    }
}

const notificationServices = new NotificationServices();

userServices.currentUserSubject.subscribe(notificationServices.refreshUserNotifications);
setInterval(notificationServices.refreshUserNotifications, 60000);

export default notificationServices;