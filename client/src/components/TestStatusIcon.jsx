import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { Badge, UncontrolledTooltip } from "reactstrap";
import constants, { TestStatus } from "../helpers/constants";

const { TEST_GLOBAL_STATUSES } = constants;

const TestStatusIcon = (props) => {
  const { status, globalStatus, t } = props;

  const statusMapping = {
    [TEST_GLOBAL_STATUSES.REQUESTED]: {
      [TestStatus.REQUESTED]: { color: "warning", icon: "fa-hourglass" },
      [TestStatus.REQUEST_CANCELLED]: { color: "default", icon: "fa-times" },
      [TestStatus.REQUEST_DECLINED]: { color: "danger", icon: "fa-hand-paper" },
      [TestStatus.REQUEST_ACCEPTED]: { color: "success", icon: "fa-check" },
    },
    [TEST_GLOBAL_STATUSES.PROCESSING]: {
      [TestStatus.REQUEST_ACCEPTED]: { color: "warning", icon: "fa-shopping-cart" },
      [TestStatus.PRODUCT_ORDERED]: { color: "warning", icon: "fa-truck" },
      [TestStatus.PRODUCT_RECEIVED]: { color: "warning", icon: "fa-box-open" },
      [TestStatus.PRODUCT_REVIEWED]: { color: "warning", icon: "fa-star" },
      [TestStatus.REVIEW_VALIDATED]: { colorad: "success", icon: "fa-star" },
      [TestStatus.REVIEW_REFUSED]: { color: "danger", icon: "fa-star" },
      [TestStatus.TEST_CANCELLED]: { color: "danger", icon: "fa-times" },
      [TestStatus.MONEY_SENT]: { color: "success", icon: "fa-dollar-sign" },
    },
    [TEST_GLOBAL_STATUSES.COMPLETED]: {
      [TestStatus.MONEY_RECEIVED]: { color: "success", icon: "fa-dollar-sign" },
    },
  };

  const getStatusColor = () => {
    if (Object.keys(statusMapping).length && statusMapping[globalStatus]) {
      if (
        statusMapping[globalStatus][status] &&
        statusMapping[globalStatus][status].color
      ) {
        return statusMapping[globalStatus][status].color;
      }
      return "success";
    }
    return "";
  };

  const getIconClass = () => {
    if (Object.keys(statusMapping).length && statusMapping[globalStatus]) {
      if (
        statusMapping[globalStatus][status] &&
        statusMapping[globalStatus][status].icon
      ) {
        return statusMapping[globalStatus][status].icon;
      }
      return "fa-check";
    }
    return "";
  };

  const tooltipId = Math.ceil(Math.random() * 10000);

  return (
    <>
      <Badge
        pill
        className="badge-circle"
        color={getStatusColor()}
        id={"status-" + tooltipId}
      >
        <i className={"fa m-auto " + getIconClass()} />
      </Badge>
      <UncontrolledTooltip delay={0} target={"status-" + tooltipId} placement="auto">
        {t(status)}
        {globalStatus === TEST_GLOBAL_STATUSES.PROCESSING &&
        status === TestStatus.REQUEST_ACCEPTED ? (
          <span>
            ,<br />
            {t("WAITING_FOR_ORDER")}
          </span>
        ) : null}
      </UncontrolledTooltip>
    </>
  );
};

TestStatusIcon.propTypes = {
  status: PropTypes.string.isRequired,
  globalStatus: PropTypes.string.isRequired,
};

export default withTranslation()(TestStatusIcon);
