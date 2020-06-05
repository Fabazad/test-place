import BaseService from "./base.service.js";
import axios from "axios";
import {Subject} from "rxjs";

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
        this.notifications = null;
        this.notifications = await axios.get(this.baseURL + "/user-notifications").then(this.serviceResolve);
        this.notificationsSubject.next();
    }
}

const notificationServices = new NotificationServices();

setTimeout(notificationServices.refreshUserNotifications, 0);
setInterval(notificationServices.refreshUserNotifications, 60000);

export default notificationServices;