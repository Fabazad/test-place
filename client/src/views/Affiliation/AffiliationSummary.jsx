import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Badge, Button, Card, CardBody, CardHeader, Col, Input, Row } from "reactstrap";
import userServices from "services/user.services";
import { AffiliationServices } from "../../services/affiliation.service";

export const AffiliationSummary = withTranslation()(({ t }) => {
  const [affiliatedCount, setAffiliatedCount] = useState(0);
  const [totalGeneratedMoney, setTotalGeneratedMoney] = useState(0);
  const [outstandingBalance, setOutstandingBalance] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await AffiliationServices.getUserAffiliationSummary();
      setAffiliatedCount(res.affiliatedCount);
      setTotalGeneratedMoney(res.totalGeneratedMoney);
      setOutstandingBalance(res.outstandingBalance);
    })();
  }, []);

  const userId = userServices.currentUser._id;
  const affiliationLink = `${window.location.origin}/register?a=${userId}`;

  const copyAffiliationLink = () => {
    navigator.clipboard.writeText(affiliationLink);
    toast.success(t("LINK_COPIED"));
  };

  return (
    <Card className="card-profile shadow bg-secondary">
      <CardHeader className="bg-white border-0">
        <div className="align-items-center">
          <h3 className="mb-0">{t("MY_AFFILIATION")}</h3>
        </div>
      </CardHeader>
      <CardBody>
        <Row>
          <Col>
            <div className="card-profile-stats d-flex justify-content-center">
              <div>
                <Badge color="light" pill className="badge-lg d-block">
                  <span className="heading">{affiliatedCount}</span>
                </Badge>
                <span className="d-inline-block description text-center">
                  {t("AFFILIATED_NUMBER")}
                </span>
              </div>
              <div>
                <Badge color="success" pill className="badge-lg d-block">
                  <span className="heading">{totalGeneratedMoney}€</span>
                </Badge>
                <span className="d-inline-block description text-center">
                  {t("TOTAL_GENERATED_MONEY")}
                </span>
              </div>
              <div>
                <Badge color="primary" pill className="badge-lg d-block">
                  <span className="heading">{outstandingBalance}€</span>
                </Badge>
                <span className="d-inline-block description text-center">
                  {t("OUTSTANDING_BALANCE")}
                </span>
              </div>
            </div>
          </Col>
        </Row>
        <hr />
        <Row className="text-center mt-3">
          <Col xs="12">
            <h3>{t("AFFILIATION_LINK")}</h3>
          </Col>
          <Col xs="12">
            <Input type="text" value={affiliationLink} readOnly />
          </Col>
          <Col xs="12">
            <Button className="mt-3" color="primary" onClick={copyAffiliationLink}>
              <i className="fa fa-copy mr-3" />
              {t("COPY_LINK")}
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
});
