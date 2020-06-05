import React from "react";
import PropTypes from "prop-types";
import Badge from "reactstrap/es/Badge";

const NotificationsButton = props => {

    const {newNotificationsNumber} = props;

    const onClick = () => {
        if (props.onClick) props.onClick();
    };

    return (
        <div className="position-relative">
            <i className="fa fa-bell text-white fa-lg" onClick={onClick}/>
            {newNotificationsNumber ?
                <Badge className="text-white bg-danger position-absolute" pill
                       style={{right: "-5px", top: "-10px"}}>
                    {newNotificationsNumber}
                </Badge>
                : null}
        </div>
    );
};

NotificationsButton.propTypes = {
    onClick: PropTypes.func,
    newNotificationsNumber: PropTypes.number.isRequired
};

export default NotificationsButton;