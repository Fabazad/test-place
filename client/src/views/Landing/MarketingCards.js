import {Badge, Button, Card, CardBody, Col, Container, Row} from "reactstrap";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import ShareModal from "../../components/Modals/ShareModal";
import {Trans, withTranslation} from "react-i18next";

const MarketingCards = (props) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);

    const { t } = props;

    return (
        <Container className="py-3">
            <Row className="justify-content-center mt-5">
                <Col md={6} lg={4} className="my-3">
                    <Card className="card-lift--hover shadow border-0">
                        <CardBody className="py-5">
                            <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                                <i className="fa fa-search"/>
                            </div>
                            <h4 className="text-primary text-uppercase">
                                {t("SEARCH_ENGINE_TITLE")}
                            </h4>
                            <p className="description mt-4 mb-5">
                                <Trans i18nKey="SEARCH_ENGINE_TEXT" default="test<bold>gye</bold>" components={{ b: <b /> }}/>
                            </p>
                            <div>
                                <Badge color="primary" pill className="mr-1">{t("FAST")}</Badge>
                                <Badge color="primary" pill className="mr-1">{t("EFFICIENT")}</Badge>
                                <Badge color="primary" pill className="mr-1">{t("COMPLETE")}</Badge>
                            </div>
                            <Button tag={Link} to="/search" className="mt-4" color="primary">
                                {t("SEARCH")}
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6} lg={4} className="my-3">
                    <Card className="card-lift--hover shadow border-0">
                        <CardBody className="py-5">
                            <div className="icon icon-shape icon-shape-success rounded-circle mb-4">
                                <i className="fa fa-shield-alt"/>
                            </div>
                            <h4 className="text-success text-uppercase">
                                {t("SUPERVISED_PROCEDURES_TITLE")}
                            </h4>
                            <p className="description mt-4 mb-5">
                                <Trans i18nKey="SUPERVISED_PROCEDURES_TEXT" components={{b: <b/>}}/>
                            </p>
                            <div>
                                <Badge color="success" pill className="mr-1">{t("EASY")}</Badge>
                                <Badge color="success" pill className="mr-1">{t("CHILL")}</Badge>
                                <Badge color="success" pill className="mr-1">{t("SAFE")}</Badge>
                            </div>
                            <Button tag={Link} to="/register" className="mt-4" color="success">
                                {t("CREATE_AN_ACCOUNT")}
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6} lg={4} className="my-3">
                    <Card className="card-lift--hover shadow border-0">
                        <CardBody className="py-5">
                            <div
                                className="icon icon-shape icon-shape-warning rounded-circle mb-4">
                                <i className="fa fa-euro-sign"/>
                            </div>
                            <h4 className="text-warning text-uppercase">
                                {t("REFUNDED_ITEMS_TITLE")}
                            </h4>
                            <p className="description mt-4 mb-5">
                                <Trans i18nKey="REFUNDED_ITEMS_TEXT" components={{ b: <b/> }}/>
                            </p>
                            <div>
                                <Badge color="warning" pill className="mr-1">{t("HEADPHONES")}</Badge>
                                <Badge color="warning" pill className="mr-1">{t("SPEAKERS")}</Badge>
                                <Badge color="warning" pill className="mr-1">{t("CAMERAS")}</Badge>
                                <Badge color="warning" pill className="mr-1">...</Badge>
                            </div>
                            <Button className="mt-4" color="warning" onClick={toggleModal}>
                                {t("SHARE")}
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <ShareModal onToggle={toggleModal} isOpen={isOpen}/>
        </Container>
    )
};

export default withTranslation()(MarketingCards);