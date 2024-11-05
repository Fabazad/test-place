import EmailLink from "components/EmailLink";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import Linkify from "react-linkify";
import { Link } from "react-router-dom";
import { Badge, Button, Modal } from "reactstrap";
import Card from "reactstrap/es/Card";
import CardBody from "reactstrap/es/CardBody";
import Col from "reactstrap/es/Col";
import Container from "reactstrap/es/Container";
import ModalBody from "reactstrap/es/ModalBody";
import ModalFooter from "reactstrap/es/ModalFooter";
import Row from "reactstrap/es/Row";
import Label from "reactstrap/lib/Label";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";
import constants, {
  STEP_KEYS,
  TEST_STATUS_TO_STEP_MAP,
  TEST_STEPS_MAP,
  TestStatus,
} from "../../../helpers/constants";
import { formatDate } from "../../../helpers/textHelpers";
import { getAmazonReviewUrl } from "../../../helpers/urlHelpers";
import testServices from "../../../services/test.services";
import Loading from "../../Loading";
import Stepper from "../../Stepper";
import TestStatusIcon from "../../TestStatusIcon";
import SellerTesterInfo from "./SellerTesterInfo";
import TestActions from "./TestActions";
import TestPrices from "./TestPrices";
import TestProcessInfo from "./TestProcessInfo";

const { USER_ROLES } = constants;

const TestModal = ({
  isOpen,
  onToggle,
  userType,
  globalStatus,
  testId,
  t,
  adminView,
}) => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (testId && isOpen) {
      setLoading(true);
      testServices
        .getOne(testId)
        .then((newTest) => {
          setTest(newTest);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
  }, [testId, isOpen]);

  if (!test) return null;

  const isOneOfStatuses = (statusesToCheck) => {
    return statusesToCheck.includes(test.status);
  };

  const getCurrentStep = ({ userType }) => {
    if (isOneOfStatuses([TestStatus.TEST_CANCELLED])) return { key: null, error: true };
    const step = TEST_STATUS_TO_STEP_MAP[userType].find((s) =>
      isOneOfStatuses(s.testStatuses)
    );

    if (step) return { key: step.stepKey, error: step.error };

    return { key: STEP_KEYS.END, error: false };
  };

  const lastUpdate =
    test.updates && test.updates.length ? test.updates[test.updates.length - 1] : {};

  const testSteps = TEST_STEPS_MAP(t)[userType];
  const currentStep = getCurrentStep({ userType });

  return (
    <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle} size="lg">
      <Loading loading={loading} />
      <div className="modal-header">
        <h3 className="modal-title mb-0">{t("TEST_DETAILS")}</h3>
        <button
          aria-label="Close"
          className="close"
          data-dismiss="modal"
          type="button"
          onClick={onToggle}
        >
          <span aria-hidden={true}>×</span>
        </button>
      </div>

      <ModalBody>
        <Container>
          <Row className="mb-3">
            <Col xs={12}>
              <Stepper
                steps={testSteps}
                currentStep={currentStep}
                endKey={STEP_KEYS.END}
              />
            </Col>
          </Row>
          <Row className="bg-secondary py-4 rounded">
            <Col xs={12} md={4} className="text-center">
              <img
                src={test.product.imageUrls[0]}
                alt=""
                className="rounded shadow-lg"
                style={{
                  height: "auto",
                  maxHeight: "150px",
                  width: "auto",
                  maxWidth: "100%",
                }}
              />
            </Col>

            <Col xs={12} md={8} className="d-flex mt-3 mt-md-0">
              <div className="my-auto">
                <Label>ASIN :</Label> <Badge color="primary">{test.product.asin}</Badge>
                <br />
                <Label>{t("TEST_REQUEST_DATE")} :</Label> {formatDate(test.createdAt)}
                <h4>
                  <Link
                    to={"/ad/" + test.product._id}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {test.product.title}
                  </Link>
                </h4>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6} className="d-flex mt-3 p-0">
              <TestPrices
                price={test.product.price}
                finalPrice={test.product.finalPrice}
              />
            </Col>

            <Col xs="12" md="6" className="d-flex mt-3 p-0">
              <SellerTesterInfo
                userRole={userType}
                tester={test.tester}
                seller={test.seller}
                amazonSeller={test.product.amazonSeller}
              />
            </Col>
          </Row>

          {userType === USER_ROLES.SELLER ? (
            <Row className="my-5">
              <Col xs={12} md={3} className="text-center">
                <Label>{t("PAYPAL_EMAIL")}</Label>
                <div>
                  <EmailLink
                    email={test.tester.paypalEmail}
                    subject={t("TESTPLACE_EMAIL_SUBJECT")}
                    body={test.product.title}
                  ></EmailLink>
                </div>
              </Col>
              {test.orderId ? (
                <Col xs={12} md={3} className="text-center mt-3 mt-sm-0">
                  <Label>{t("COMMAND_NUMBER")}</Label>
                  <div>
                    <Badge color="info">{test.orderId}</Badge>
                  </div>
                </Col>
              ) : null}
              {test.orderScreenshotUrl ? (
                <Col xs={12} md={3} className="text-center mt-3 mt-sm-0">
                  <Label>{t("ORDER_SCREENSHOT")}</Label>
                  <div>
                    <a
                      href={test.orderScreenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={"order-screenshot-" + test._id}
                    >
                      <img
                        src={test.orderScreenshotUrl}
                        alt="Order Screenshot"
                        className="img-fluid"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    </a>
                    <UncontrolledTooltip
                      target={"order-screenshot-" + test._id}
                      delay={0}
                    >
                      {t("CLICK_TO_OPEN")}
                    </UncontrolledTooltip>
                  </div>
                </Col>
              ) : null}
              {test.reviewId ? (
                <Col xs={12} md={3} className="text-center">
                  <Label>{t("REVIEW_LINK")}</Label>
                  <div>
                    <a
                      href={getAmazonReviewUrl(test.reviewId)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("LINK")}
                    </a>
                  </div>
                </Col>
              ) : null}
              {test.reviewScreenshotUrl ? (
                <Col xs={12} md={3} className="text-center mt-3 mt-sm-0">
                  <Label>{t("REVIEW_SCREENSHOT")}</Label>
                  <div>
                    <a
                      href={test.reviewScreenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={"review-screenshot-" + test._id}
                    >
                      <img
                        src={test.reviewScreenshotUrl}
                        alt="Review Screenshot"
                        className="img-fluid"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    </a>
                    <UncontrolledTooltip
                      target={"review-screenshot-" + test._id}
                      delay={0}
                    >
                      {t("CLICK_TO_OPEN")}
                    </UncontrolledTooltip>
                  </div>
                </Col>
              ) : null}
              {test.product.privateNote ? (
                <Col xs={12} className="mt-3">
                  <Card>
                    <CardBody>
                      <Label>{t("PRIVATE_NOTES")}</Label>
                      <small className="d-block">
                        <Linkify properties={{ target: "_blank" }}>
                          {test.product.privateNote}
                        </Linkify>
                      </small>
                    </CardBody>
                  </Card>
                </Col>
              ) : null}
            </Row>
          ) : null}

          <Row className="mt-3 bg-white border rounded py-4 shadow">
            <Col xs={6} className="text-center">
              <Label>{t("REQUEST_STATUS")}</Label>
              <div>
                <TestStatusIcon status={test.status} globalStatus={globalStatus} />
                <span className="ml-2">{t(test.status)}</span>
              </div>
            </Col>
            <Col xs={6} className="text-center">
              <Label>{t("STATUS_CHANGED_DATE")}</Label>
              <div>{lastUpdate ? formatDate(lastUpdate.date) : "-"}</div>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col xs={12}>
              <TestProcessInfo
                test={test}
                userRole={userType}
                onToggle={onToggle}
                adminView={adminView}
              />
            </Col>
          </Row>
          <TestActions test={test} userRole={userType} onToggle={onToggle} />
        </Container>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
          {t("CLOSE")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

TestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  globalStatus: PropTypes.string.isRequired,
  adminView: PropTypes.bool.isRequired,
};

export default withTranslation()(TestModal);
