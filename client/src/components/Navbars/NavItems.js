import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import Badge from "reactstrap/es/Badge";
import Nav from "reactstrap/es/Nav";
import NavItem from "reactstrap/es/NavItem";
import testServices from "../../services/test.services";
import userServices from "../../services/user.services";

const NavItems = ({ routes, t }) => {
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

  return (
    <Nav className="d-md-none position-relative mt-3 d-block mx-2">
      {routes.map((route) => (
        <NavItem
          to={route.layout + route.path}
          tag={Link}
          key={"route" + route.path}
          className="text-dark d-block mt-3"
        >
          <i className={route.icon + " text-" + route.color + " mr-3"} />
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
        </NavItem>
      ))}
      <NavItem className="cursor-pointer d-block mt-3" onClick={onLogout}>
        <span className="nav-link-inner--text" data-testid="logout-button">
          <i className="fa fa-sign-out-alt mr-3 text-danger" />
          {t("LOG_OUT")}
        </span>
      </NavItem>
    </Nav>
  );
};

NavItems.propTypes = {
  routes: PropTypes.array.isRequired,
};

export default withTranslation()(NavItems);
