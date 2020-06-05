import React from "react";
import PropTypes from "prop-types";

const NotificationsButton = props => {

    const {newNotifications} = props;

    const onClick = () => {
        if (props.onClick) props.onClick();
    };

    return (
        <div className="position-relative">
            <i className="fa fa-bell text-white" onClick={onClick}/>
            {newNotifications ?
                <i className="fa fa-circle fa-xs text-warning position-absolute" style={{right: '-5px'}}/>
                : null}
        </div>
    );
};

NotificationsButton.propTypes = {
    onClick: PropTypes.func,
    newNotifications: PropTypes.bool.isRequired
};

export default NotificationsButton;