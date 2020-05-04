import React from "react";
import { Link } from "react-router-dom";
import userServices from "../services/user.services";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import ForgottenPasswordModal from "components/Modals/ForgottenPasswordModal";
import ResendValidationMailModal from "../components/Modals/ResendValidationMailModal";
import LoginForm from "../components/Forms/LoginForm";


class Login extends React.Component {

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }

  onLogin() {
    if (userServices.currentUser && userServices.currentUser.lastLogin) {
      this.props.history.push('/');
    } else {
      this.props.history.push('/dashboard/my-profile#first-login');
    }
  }

  render() {
    return (
      <>
        <main ref="main" id="login">
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
                    <CardHeader className="bg-white pb-5">
                      <div className="text-muted text-center mb-3">
                        <small>Se connecter</small>
                      </div>
                      <div className="btn-wrapper text-center">
                        <Button
                          className="btn-neutral btn-icon"
                          color="default"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <span className="btn-inner--icon mr-1">
                            <img
                              alt="..."
                              src={require("assets/img/icons/common/github.svg")}
                            />
                          </span>
                          <span className="btn-inner--text">Github</span>
                        </Button>
                        <Button
                          className="btn-neutral btn-icon ml-1"
                          color="default"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <span className="btn-inner--icon mr-1">
                            <img
                              alt="..."
                              src={require("assets/img/icons/common/google.svg")}
                            />
                          </span>
                          <span className="btn-inner--text">Google</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                      <LoginForm onLogin={() => this.onLogin()}/>
                      <Row className="mt-4">
                        <Col xs="6">
                          <ForgottenPasswordModal/>
                        </Col>
                        <Col className="text-right" xs="6">
                          <Link to="/register" className="text-primary">
                            <small>Nouveau compte</small>
                          </Link>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <div className="col-12 text-center">
                          <ResendValidationMailModal/>
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
  }
}

export default Login;
