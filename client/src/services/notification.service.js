import BaseService from "./base.service.js";
import axios from "axios";
import {Subject} from "rxjs";
import userServices from "./user.services";

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
            this.notifications = await axios.get(this.baseURL + "/user-notifications").then(this.serviceResolve);
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