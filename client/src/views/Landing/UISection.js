import {Badge, Col, Container, Row} from "reactstrap";
import React from "react";

const UISection = () => {
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
                        <h2>Une ergonomie agréable</h2>
                        <p className="mt-5">
                            L'application a été pensée pour vous donner la <b>meilleure expérience utilisateur possible</b>.<br/><br/>
                            Suivez vos tests de produits sur une interface<br/>
                            <b>fluide et visuelle</b>.
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

export default UISection;