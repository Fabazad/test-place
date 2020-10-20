import {Col, Container, Row} from "reactstrap";
import React from "react";
import {Trans, withTranslation} from "react-i18next";

const UISection = props => {

    const { t } = props;

    return (
        <Container>
            <Row className="row-grid align-items-center">
                <Col md="6">
                    <div className="pr-md-5">
                        <div
                            className="icon icon-lg icon-shape icon-shape-success shadow rounded-circle mb-5">
                            <img src={require('assets/img/brand/creative-tim.png')} alt="creative tim logo"/>
                        </div>
                        <h4 className="d-inline-block ml-3">Creative Tim</h4>
                        <h2>{t("GREAT_DESIGN")}</h2>
                        <p className="mt-5">
                            <Trans i18nKey="GREAT_DESIGN_TEXT" components={{ b: <b /> }}/>
                        </p>
                    </div>
                </Col>
                <Col md="6">
                    <img
                        alt="..."
                        className="img-fluid floating"
                        src={require("assets/img/theme/promo-1.png")}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default withTranslation()(UISection);