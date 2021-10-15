import Modal from "reactstrap/es/Modal";
import NotificationsList from "./NotificationsList";
import {DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import React, {useEffect, useState} from "react";
import NotificationsButton from "./NotificationsButton";
import userServices from "../../services/user.services";
import notificationServices from "../../services/notification.service";
import {withTranslation} from "react-i18next";

const Notifications = ({t}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [newNotificationsNumber, setNewNotificationsNumber] = useState(0);

    const refreshNotifications = () => {
        setNotifications(notificationServices.getUserNotifications());
    };

    useEffect(() => {
        if (userServices.currentUser) {
            refreshNotifications();
            const subscriber = notificationServices.notificationsSubject.subscribe(refreshNotifications);
            return () => subscriber.unsubscribe();
        }
    }, []);

    useEffect(() => {
        if (notifications && notifications.length) {
            const newNotifications = notifications.filter(notification => !notification.viewDate);
            setNewNotificationsNumber(newNotifications.length);
        }
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

        if (justViewedNotificationsIds.length) {
            notificationServices.setNotificationsViewed(justViewedNotificationsIds)
        }
    };

    return (
        <div className="notifications">
            <div className="d-block d-md-none">
                <NotificationsButton onClick={toggleModal} newNotificationsNumber={newNotificationsNumber}/>
                <Modal className="modal-dialog-centered" toggle={toggleModal} isOpen={isOpen}>
                    <div className="modal-header">
                        <h4 className="modal-title" id="exampleModalLabel">
                            <i className="fa fa-bell mr-3 text-primary"/>{t("NOTIFICATIONS")}
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
                    <NotificationsButton newNotificationsNumber={newNotificationsNumber}/>
                </DropdownToggle>
                <DropdownMenu className='w-400px position-absolute'>
                    <div className="px-3 py-2">
                        <i className="fa fa-bell text-primary mr-3"/>{t("NOTIFICATIONS")}
                    </div>
                    <NotificationsList notifications={notifications}/>
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    )
};

export default withTranslation()(Notifications);