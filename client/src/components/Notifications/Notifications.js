import Modal from "reactstrap/es/Modal";
import NotificationsList from "./NotificationsList";
import {DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import React, {useEffect, useState} from "react";
import NotificationsButton from "./NotificationsButton";
import userServices from "../../services/user.services";
import notificationServices from "../../services/notification.service";

const Notifications = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [newNotifications, setNewNotifications] = useState(false);

    const refreshNotifications = () => {
        setNotifications(notificationServices.getUserNotifications());
    };

    useEffect(() => {
        if (userServices.currentUser) {
            refreshNotifications();
            notificationServices.notificationsSubject.subscribe(refreshNotifications);
        }
    }, []);

    useEffect(() => {
        setNewNotifications(!!notifications && notifications.some(notification => !notification.viewDate))
    }, [notifications]);

    const toggleModal = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            clearNotifications();
        }
    };

    const clearNotifications = () => {
        const justViewedNotificationsIds = notificationServices.getUserNotifications()
            .filter(notif => !notif.viewDate).map(notif => notif._id);
        if (justViewedNotificationsIds.length){
            console.log("clear notifications", justViewedNotificationsIds);
            notificationServices.refreshUserNotifications().then(() => {});
        }
    };

    return (
        <div className="notifications">
            <div className="d-block d-md-none">
                <NotificationsButton onClick={toggleModal} newNotifications={newNotifications}/>
                <Modal className="modal-dialog-centered" toggle={toggleModal} isOpen={isOpen}>
                    <div className="modal-header">
                        <h4 className="modal-title" id="exampleModalLabel">
                            <i className="fa fa-bell mr-3 text-primary"/>Notifications
                        </h4>
                        <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                onClick={toggleModal}>
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body p-0">
                        <NotificationsList notifications={notifications}/>
                    </div>
                    <div className="modal-footer">
                    </div>
                </Modal>
            </div>
            <UncontrolledDropdown className="d-none d-md-block">
                <DropdownToggle nav onClick={clearNotifications}>
                    <NotificationsButton newNotifications={newNotifications}/>
                </DropdownToggle>
                <DropdownMenu className='w-400px position-absolute' >
                    <div className="px-3 py-2">
                        <i className="fa fa-bell text-primary mr-3"/>Notifications
                    </div>
                    <NotificationsList notifications={notifications}/>
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    )
};

export default Notifications;