import React from "react";
import {Link} from "react-router-dom";

// reactstrap components
import {
    Card,
    CardBody,
    Container,
    Row,
    Col
} from "reactstrap";

// core components
import SimpleFooter from "../components/Footers/SimpleFooter.jsx";
import ForgottenPasswordModal from "../components/Modals/ForgottenPasswordModal";
import ResendValidationMailModal from "../components/Modals/ResendValidationMailModal";
import LoginForm from "../components/Forms/LoginForm";
import Alert from "reactstrap/es/Alert";
import {useLastLocation} from 'react-router-last-location';
import history from "../history";

const Login = () => {

    const lastLocation = useLastLocation();

    const onLogin = () => {
        history.push(lastLocation.pathname ?? "/");
    };

    return (
        <>
            <main id="login">
                <section className="section section-shaped section-lg">
                    <div className="shape shape-style-1 bg-gradient-default">
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                    </div>
                    <Container className="pt-lg-md">
                        <Row className="justify-content-center">
                            <Col lg="5">
                                <Card className="bg-secondary shadow border-0">
                                    {/*<CardHeader className="bg-white pb-4">
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
                    </CardHeader>*/}
                                    <CardBody className="p-lg-4">
                                        <div className="mt-3">
                                            <LoginForm onLogin={onLogin}/>
                                        </div>
                                        <div className="mt-3">
                                            <Alert color="info">
                                                Pensez à ajouter le site à vos favoris pour facilement le retrouver.
                                            </Alert>
                                        </div>
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
            <SimpleFooter/>
        </>
    );
};

export default Login;
