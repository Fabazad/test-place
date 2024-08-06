import React from "react";
import { Link, useHistory } from "react-router-dom";

// reactstrap components
import { Card, CardBody, Col, Container, Row } from "reactstrap";

// core components
import { withTranslation } from "react-i18next";
import Alert from "reactstrap/es/Alert";
import SimpleFooter from "../components/Footers/SimpleFooter.jsx";
import LoginForm from "../components/Forms/LoginForm";
import ForgottenPasswordModal from "../components/Modals/ForgottenPasswordModal";
import ResendValidationMailModal from "../components/Modals/ResendValidationMailModal";

const Login = (props) => {
  const { t } = props;

  const history = useHistory();

  const onLogin = (user) => {
    if (user.roles.includes("SELLER")) {
      history.push({
        pathname: "/dashboard/my-products",
        hash: user.lastLogin ? "" : "#postProductModal",
      });
    } else {
      history.push("/search");
    }
  };

  return (
    <>
      <main id="login">
        <section className="section section-shaped section-lg">
          <div className="shape shape-style-1 bg-gradient-default">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <Container className="pt-lg-md">
            <Row className="justify-content-center">
              <Col lg="5">
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="p-lg-4">
                    <div className="w-100 text-center mb-4">
                      <img
                        src={require("assets/img/undraws/authentication.svg").default}
                        alt=""
                        className="w-100"
                        style={{ maxWidth: "150px" }}
                      />
                    </div>
                    <div className="mt-3">
                      <LoginForm onLogin={onLogin} />
                    </div>
                    <div className="mt-3">
                      <Alert color="info">{t("ADD_BOOKMARK")}</Alert>
                    </div>
                    <Row className="mt-4">
                      <Col xs="6">
                        <ForgottenPasswordModal />
                      </Col>
                      <Col className="text-right" xs="6">
                        <Link to="/register" className="text-primary">
                          <small>{t("CREATE_ACCOUNT")}</small>
                        </Link>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <div className="col-12 text-center">
                        <ResendValidationMailModal />
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default withTranslation()(Login);
