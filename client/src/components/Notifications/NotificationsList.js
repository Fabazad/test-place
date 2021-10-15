import ListGroup from "reactstrap/es/ListGroup";
import React from "react";
import NotificationItem from "./NotificationItem";
import Loading from "../Loading";
import PropTypes from "prop-types";
import {withTranslation} from "react-i18next";

const NotificationsList = props => {

    const {notifications, t} = props;

    if (!notifications) {
        return (
            <div className="p-5 position-relative" style={{height: "400px"}}>
                <Loading loading={true}/>
            </div>
        );
    }

    if (!notifications.length) {
        return (
            <div className="text-center p-5">
                <img src={require('assets/img/undraws/dog_walking.svg')} alt="" className="w-50"/>
                <h3 className="mt-4">{t("NO_NOTIFICATIONS")}</h3>
                <p className="mt-0 mb-5 h5">{t("YOU_CAN_CHILL")}</p>
            </div>
        )
    }

    return (
        <div style={{maxHeight: "500px"}} className="overflow-y-scroll">
            <ListGroup flush>
                {notifications.map((notification, index) => (
                    <NotificationItem notification={notification} key={index}/>
                ))}
            </ListGroup>
        </div>
    )
};

NotificationsList.propTypes = {
    notifications: PropTypes.array
};

export default withTranslation()(NotificationsList);