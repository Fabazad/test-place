import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import DropdownSelect from "../../components/DropdownSelect";
// nodejs library that concatenates classes

// reactstrap components
import { Button, Col, Container, Form, Row } from "reactstrap";

// core components

// index page sections
import SimpleFooter from "../../components/Footers/SimpleFooter";
import SearchEngine from "../../components/SearchEngine";
import constants from "../../helpers/constants";
import { scrollTo } from "../../helpers/scrollHelpers";
import { updateURLParameters } from "../../helpers/urlHelpers";
import {
  default as userService,
  default as userServices,
} from "../../services/user.services";
import CommunityCard from "./CommunityCard";
import ContactSections from "./ContactSections";
import UISection from "./FreeProducts";
import MarketingCards from "./MarketingCards";
import ProductDisplay from "./ProductDisplay";
import TestProcess from "./TestProcess";

const Landing = (props) => {
  const { location, t } = props;

  const [currentUser, setUser] = useState(userService.currentUser);
  const [userId, setUserId] = useState(null);
  const [usersOptions, setUsersOptions] = useState([]);

  useEffect(() => {
    const subscriber = userService.currentUserSubject.subscribe(setUser);

    const isAdmin = userService.hasRole(constants.USER_ROLES.ADMIN);
    if (isAdmin) {
      userService.getUsers().then((res) => {
        setUsersOptions(
          res.data.map((user) => ({ value: user.userId, text: user.name }))
        );
      });
    }
    return () => subscriber.unsubscribe();
  }, []);

  const isAdmin = userService.hasRole(constants.USER_ROLES.ADMIN);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        scrollTo(location.hash.slice(1));
      }, 200);
    } else {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }, [location]);

  const onSearch = (searchData) => {
    updateURLParameters(searchData, "/search");
  };

  const onImpersonate = async (e) => {
    e.preventDefault();

    await userServices.impersonate(userId);
  };

  return (
    <>
      <main>
        <div className="position-relative">
          {/* shape Hero */}
          <section className="section section-lg section-shaped pb-250">
            <div className="shape shape-style-1 shape-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <Container className="py-lg-4">
              {!currentUser && (
                <Row className="d-lg-none text-center my-4">
                  <Col lg="12">
                    <Link to="/register" className="btn btn-secondary">
                      {t("START_NOW")}
                    </Link>
                  </Col>
                </Row>
              )}
              {isAdmin && (
                <Form
                  style={{ width: "15rem" }}
                  className="m-auto d-flex"
                  onSubmit={onImpersonate}
                >
                  <DropdownSelect
                    type="text"
                    name="search"
                    placeholder="Impersonate (userId)"
                    className="form-control-alternative"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    options={usersOptions}
                  />
                  <Button type="submit" disabled={!userId} className="ml-3">
                    GO
                  </Button>
                </Form>
              )}
              <Row>
                <Col lg="12 text-center">
                  <h1 className="display-4 text-white">
                    <span>{t("LANDING_PAGE_TITLE_1")}</span>
                  </h1>
                  <h1 className="display-4 text-white">
                    <span>{t("LANDING_PAGE_TITLE_2")}</span>
                  </h1>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col className="p-4 rounded bg-translucent-light">
                  <SearchEngine onSearch={onSearch} data={{}} />
                </Col>
              </Row>
            </Container>
            {/* SVG separator */}
            <div className="separator separator-bottom separator-skew">
              <svg
                className="w-100"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon className="fill-secondary" points="2560 0 2560 100 0 100" />
              </svg>
            </div>
          </section>
          {/* 1st Hero Variation */}
        </div>
        <section className="section section-lg mt--200 mt--60px pt-0 pb-5">
          <ProductDisplay />
        </section>
        <section
          className="section section-lg py-5 my-3 bg-gradient-success"
          id="how-it-works"
        >
          <TestProcess />
          <MarketingCards />
        </section>
        <section className="section section-lg" id="free-products">
          <UISection />
        </section>
        <section className="section section-lg pt-0">
          <Container>
            <CommunityCard />
          </Container>
        </section>

        <ContactSections />
      </main>

      <SimpleFooter />
    </>
  );
};

export default withTranslation()(Landing);
