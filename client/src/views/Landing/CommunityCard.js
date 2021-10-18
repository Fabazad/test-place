import {Button, Card, Col, Row} from "reactstrap";
import React from "react";
import {Link} from "react-router-dom";
import { withTranslation } from "react-i18next";
import ConfirmButton from "../../components/Buttons/ConfirmButton";

const CommunityCard = (props) => {
    const { t } = props;
    return (
        <Card className="bg-gradient-warning shadow-lg border-0">
            <div className="p-5">
                <Row className="align-items-center">
                    <Col lg="8">
                        <h2 className="text-white">{t("JOIN_COMMUNITY_TITLE")}</h2>
                        <p className="lead text-white mt-4 mb-3 white-space-pre-line">
                            {t("JOIN_COMMUNITY_TEXT")}
                        </p>
                    </Col>
                    <Col className="ml-lg-auto" lg="3">
                        <Link to="/register">
                            <Button block className="btn-white" color="default" size="lg">
                                {t("JOIN")}
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </div>
        </Card>
    );
};

export default withTranslation()(CommunityCard);