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
import {withTranslation} from "react-i18next";
import SocialLogin from "../components/SocialLogin";

const Login = props => {

    const { t } = props;

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
                                    <CardBody className="p-lg-4">
                                        <div className="w-100 text-center mb-4">
                                            <img src={require('assets/img/undraws/authentication.svg')} alt="" className="w-100"
                                                 style={{maxWidth: "150px"}}/>
                                        </div>
                                        <SocialLogin className="mt-3">Connectez vous avec</SocialLogin>
                                        <div className="mt-3">
                                            <LoginForm onLogin={onLogin}/>
                                        </div>
                                        <div className="mt-3">
                                            <Alert color="info">
                                                {t("ADD_BOOKMARK")}
                                            </Alert>
                                        </div>
                                        <Row className="mt-4">
                                            <Col xs="6">
                                                <ForgottenPasswordModal/>
                                            </Col>
                                            <Col className="text-right" xs="6">
                                                <Link to="/register" className="text-primary">
                                                    <small>{t("CREATE_ACCOUNT")}</small>
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

export default withTranslation()(Login);
