import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import Badge from "reactstrap/es/Badge";
import testServices from "../../services/test.services";
import userServices from "../../services/user.services";

const ProfileDropdownBadge = (props) => {
  const { routes, t } = props;

  const history = useHistory();

  const [testGlobalStatusesCount, setTestGlobalStatusesCount] = useState(null);

  useEffect(() => {
    setTestGlobalStatusesCount(testServices.testGlobalStatusesCount);
    const subscriber = testServices.testCountSubject.subscribe((res) => {
      setTestGlobalStatusesCount(res);
    });

    return () => subscriber.unsubscribe();
  }, []);

  const onLogout = () => {
    userServices.logout();
    history.push("/");
  };

  if (!userServices.currentUser) return null;

  return (
    <UncontrolledDropdown className="profile-dropdown-badge">
      <DropdownToggle nav>
        <Badge color="primary" pill className="shadow--hover d-flex flex-align-center">
          <i className="ni ni-circle-08 ni-2x" style={{ top: "0px" }} />
          <div
            className="mr-2 d-inline-block ml-2 ml-md-0"
            style={{ fontSize: "1.2em", verticalAlign: "super", left: "80px" }}
          >
            {userServices.currentUser.name}
          </div>
          <i className="fa fa-chevron-down" />
        </Badge>
      </DropdownToggle>
      <DropdownMenu className="w-250px position-xs-static position-md-absolute">
        {routes.map((route) => (
          <DropdownItem
            to={route.layout + route.path}
            tag={Link}
            key={"route" + route.path}
          >
            <i className={route.icon + " text-" + route.color} />
            {route.name}
            {testGlobalStatusesCount && route.testCount ? (
              <Badge
                color={route.color}
                className="position-absolute"
                style={{ right: "15px" }}
              >
                {testGlobalStatusesCount[route.testCount]}
              </Badge>
            ) : null}
          </DropdownItem>
        ))}
        <DropdownItem className="cursor-pointer" onClick={onLogout}>
          <span className="nav-link-inner--text" data-testid="logout-button">
            <i className="fa fa-sign-out-alt mr-3 text-danger" />
            {t("LOG_OUT")}
          </span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

ProfileDropdownBadge.propTypes = {
  routes: PropTypes.array.isRequired,
};

export default withTranslation()(ProfileDropdownBadge);
