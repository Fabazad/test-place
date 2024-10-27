import React from "react";
import { Col, Container, Row } from "reactstrap";
import { AffiliationExplanationModal } from "./AffiliationExplanationModal";
import { AffiliationHeader } from "./AffiliationHeader";
import { AffiliationHistory } from "./AffiliationHistory";
import { AffiliationSummary } from "./AffiliationSummary";
import { MyAffiliated } from "./MyAffiliated/MyAffiliated";

export const Affiliation = () => {
  return (
    <>
      <AffiliationHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col
            className="order-xl-2 mb-5 mb-xl-0 d-flex flex-column"
            xl="4"
            style={{ gap: "3rem" }}
          >
            <AffiliationSummary />
            <AffiliationExplanationModal />
          </Col>
          <Col className="order-xl-1 d-flex flex-column" style={{ gap: "3rem" }} xl="8">
            <MyAffiliated />
            <AffiliationHistory />
          </Col>
        </Row>
      </Container>
    </>
  );
};
