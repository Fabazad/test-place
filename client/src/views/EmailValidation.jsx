import React, {useEffect, useState} from "react";

// reactstrap components
import {
    Card,
    CardBody,
    Container,
    Row,
    Col
} from "reactstrap";
import {Link} from "react-router-dom";

// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import Loading from "components/Loading";
import userServices from "services/user.services";
import AnimatedCheck from "components/AnimatedCheck";
import AnimatedError from "components/AnimatedError";
import {withTranslation} from "react-i18next";


const EmailValidation = props => {

  const { t } = props;

    const [loadingPromise, setLoadingPromise] = useState(null);
    const [validate, setValidate] = useState(null);

    useEffect(() => {
        const loadingPromise = userServices.emailValidation(props.match.params.userId)
            .then(() => setValidate(true))
            .catch(() => setValidate(false));
        setLoadingPromise(loadingPromise);
    }, []);

    return (
        <>
            <main>
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
                                    <CardBody className="px-lg-5 py-lg-5">
                                        <Loading promise={loadingPromise}/>
                                        {validate === true ?
                                            <div className="text-center">
                                                <AnimatedCheck/>
                                                <p className="success">{t("EMAIL_CHECKED")}</p>
                                                <p className="text-center text-primary">
                                                    <Link to='/login'><small>{(t("LOG_IN"))}</small></Link>
                                                </p>
                                            </div> : null}
                                        {validate === false ?
                                            <div className="text-center">
                                                <AnimatedError text={t('EMAIL_NOT_CHECKED')}/>
                                            </div> : null}
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

export default withTranslation()(EmailValidation);
