import ListGroup from "reactstrap/es/ListGroup";
import React from "react";
import NotificationItem from "./NotificationItem";
import Loading from "../Loading";
import PropTypes from "prop-types";

const NotificationsList = props => {

    const {notifications} = props;

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
                <h3 className="mt-4">AUCUNE NOTIFICATION</h3>
                <p className="mt-0 mb-5 h5">Vous êtes tranquille pour le moment.</p>
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

export default NotificationsList;