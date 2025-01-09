import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Badge from "reactstrap/es/Badge";
import Col from "reactstrap/es/Col";
import ListGroupItem from "reactstrap/es/ListGroupItem";
import Row from "reactstrap/es/Row";
import constants from "../../helpers/constants";
import { textSlice } from "../../helpers/textHelpers";
import userServices from "../../services/user.services";

const { NOTIFICATION_TYPES } = constants;

const NotificationItem = (props) => {
  const { notification, t } = props;

  const currentUser = userServices.currentUser;

  const isUserTester = currentUser.roles.includes("TESTER");

  const timeDifference = () => {
    const createdAtMoment = dayjs(notification.createdAt);
    const minutes = dayjs().diff(createdAtMoment, "minutes");
    if (minutes < 60) return minutes + "min";
    const hours = dayjs().diff(createdAtMoment, "hours");
    if (hours < 24) return hours + "h";
    const days = dayjs().diff(createdAtMoment, "days");
    return days + "j";
  };

  const notificationType = NOTIFICATION_TYPES(t, isUserTester)[notification.type];

  return (
    <ListGroupItem
      className="list-group-item-action"
      tag={Link}
      to={notificationType.to + "?testId=" + notification.test._id}
    >
      <Row className="align-items-center">
        <Col className="col-auto">
          <Badge
            color={notificationType.color}
            pill
            className="icon icon-xs icon-shape shadow rounded-circle"
          >
            <i className={"fa fa-2x " + notificationType.icon} />
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
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
};

export default withTranslation()(NotificationItem);
