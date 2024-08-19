/*eslint-disable*/
import React, { useState } from "react";
// reactstrap components
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Col, Container, Nav, NavItem, NavLink, Row } from "reactstrap";
import ShareModal from "../Modals/ShareModal";

const SimpleFooter = (props) => {
  const { t } = props;

  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      <footer className=" footer">
        <Container>
          <Row className=" row-grid align-items-center mb-5">
            <Col lg="6">
              <h3 className=" text-primary font-weight-light mb-2">
                {t("THANKS_FOR_VISITING")}
              </h3>
            </Col>
          </Row>
          <hr />
          <Row className=" align-items-center justify-content-md-between">
            <Col md="6">
              <div className=" copyright">
                © {new Date().getFullYear()}{" "}
                <a href="http://test-place.fr" target="_blank">
                  Test Place
                </a>
                .
              </div>
            </Col>
            <Col md="6">
              <Nav className=" nav-footer justify-content-end">
                <NavItem>
                  <NavLink onClick={toggleModal} className="cursor-pointer">
                    {t("SHARE")}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className="cursor-pointer"
                    onClick={() => window.$crisp.push(["do", "chat:open"])}
                  >
                    {t("CONTACT_US")}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/register#privacyPolicy">
                    CGU
                  </NavLink>
                </NavItem>
              </Nav>
            </Col>
          </Row>
        </Container>
      </footer>
      <ShareModal onToggle={toggleModal} isOpen={isOpen} />
    </>
  );
};

export default withTranslation()(SimpleFooter);
