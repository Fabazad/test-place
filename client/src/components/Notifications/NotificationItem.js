import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import ListGroupItem from "reactstrap/es/ListGroupItem";
import React from "react";
import Badge from "reactstrap/es/Badge";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import {withTranslation} from "react-i18next";
import {textSlice} from "../../helpers/textHelpers";
import constants from "../../helpers/constants";

const {NOTIFICATION_TYPES} = constants;

const NotificationItem = props => {

    const {notification, t} = props;

    const timeDifference = () => {
        const createdAtMoment = moment(notification.createdAt);
        const minutes = moment().diff(createdAtMoment, 'minutes');
        if (minutes < 60) return minutes + 'min';
        const hours = moment().diff(createdAtMoment, 'hours');
        if (hours < 24) return hours + 'h';
        const days = moment().diff(createdAtMoment, 'days');
        return days + 'j';
    };

    const notificationType = NOTIFICATION_TYPES[notification.type];

    return (
        <ListGroupItem className="list-group-item-action" tag={Link} to={notificationType.to + "?testId=" + notification.test._id}>
            <Row className="align-items-center">
                <Col className="col-auto">
                    <Badge color={notificationType.color} pill
                           className="icon icon-xs icon-shape shadow rounded-circle">
                        <i className={"fa fa-2x " + notificationType.icon}/>
                    </Badge>
                </Col>
                <div className="col ml--2">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="mb-0 text-sm">{t(notification.type)}</h4>
                        </div>
                        <div className="text-right text-muted">
                            <small>{timeDifference()}</small>
                        </div>
                    </div>
                    <p className="text-sm mb-0 mt-1 text-left">
                        {notificationType.text}&nbsp;
                        <b>{textSlice(notification.test.product.title, 25)}</b>.
                    </p>
                </div>
            </Row>
        </ListGroupItem>
    )
};

NotificationItem.propTypes = {
    notification: PropTypes.object.isRequired,
};

export default withTranslation()(NotificationItem);