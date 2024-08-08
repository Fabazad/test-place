import React, { useState } from "react";
// reactstrap components
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import Alert from "reactstrap/es/Alert";
import Button from "reactstrap/es/Button";
import Form from "reactstrap/es/Form";
import FormGroup from "reactstrap/es/FormGroup";
import Input from "reactstrap/es/Input";
import { TestStatus } from "../../helpers/constants";
import testServices from "../../services/test.services";
import userServices from "../../services/user.services";
import Loading from "../Loading";
import ReviewAdvices from "../ReviewAdvices";

const AnswerTestRequestForm = (props) => {
  const { testId, t, onSubmit } = props;

  const [tabs, setTabs] = useState(0);
  const [declineReason, setDeclineReason] = useState("");
  const [sellerMessage, setSellerMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setTabs(index);
    setDeclineReason("");
    setSellerMessage(userServices.currentUser.sellerMessage ?? "");
  };

  const declineRequest = async (e) => {
    if (e) e.preventDefault();
    if (!declineReason) {
      toast.error(t("MISSING_DECLINE_REASON"));
    }
    setLoading(true);
    testServices
      .updateStatus(testId, TestStatus.REQUEST_DECLINED, {
        declineRequestReason: declineReason,
      })
      .then(() => {
        onSubmit();
        toast.success(t("TEST_REQUEST_DECLINED"));
      })
      .finally(() => setLoading(false));
  };

  const acceptRequest = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    testServices
      .updateStatus(testId, TestStatus.REQUEST_ACCEPTED, { sellerMessage: sellerMessage })
      .then(() => {
        onSubmit();
        toast.success(t("TEST_REQUEST_ACCEPTED"));
      })
      .finally(() => setLoading(false));
  };
  return (
    <>
      <div className="nav-wrapper">
        <Nav
          className="nav-fill flex-column flex-md-row"
          id="tabs-icons-text"
          pills
          role="tablist"
        >
          <NavItem>
            <NavLink
              aria-selected={tabs === 1}
              className={
                "mb-sm-3 mb-md-0 " + (tabs === 1 ? "active bg-danger" : "text-danger")
              }
              onClick={(e) => toggleNavs(e, 1)}
              href="#pablo"
              role="tab"
            >
              <i className="fa fa-hand-paper mr-2" />
              {t("DECLINE")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              aria-selected={tabs === 2}
              className={
                "mb-sm-3 mb-md-0 " + (tabs === 2 ? "active bg-success" : "text-success")
              }
              onClick={(e) => toggleNavs(e, 2)}
              href="#pablo"
              role="tab"
            >
              <i className="fa fa-check mr-2" />
              {t("ACCEPT")}
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      {tabs ? (
        <TabContent activeTab={"tabs" + tabs}>
          <TabPane tabId="tabs1">
            <Form className="mt-3" onSubmit={declineRequest}>
              <Loading loading={loading} />
              <FormGroup>
                <Input
                  className="form-control-alternative"
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder={t("DECLINE_REASON_PLACEHOLDER")}
                  rows="3"
                  type="textarea"
                  minLength={30}
                />
              </FormGroup>
              <Button color="danger" type={"submit"} disabled={!declineReason}>
                {t("DECLINE")}
              </Button>
            </Form>
          </TabPane>
          <TabPane tabId="tabs2">
            <Form className="mt-3" onSubmit={acceptRequest}>
              <Loading loading={loading} />
              <FormGroup>
                <Input
                  className="form-control-alternative"
                  onChange={(e) => setSellerMessage(e.target.value)}
                  placeholder={t("SELLER_MESSAGE_PLACEHOLDER")}
                  rows="3"
                  type="textarea"
                  defaultValue={userServices.currentUser.sellerMessage ?? ""}
                />
              </FormGroup>
              <Alert color="warning" className="text-left white-space-pre-line">
                <strong>{t("WARNING")}</strong>
                <br />
                {t("DONT_GIVE_INSTRUCTIONS_TO_FIND_PRODUCT")}
              </Alert>
              <Alert color="info" className="text-left">
                {t("TESTER_WILL_BE_ADVISED")}
                <br />
                <ReviewAdvices />
              </Alert>
              <Button color="success" type="submit">
                {t("ACCEPT")}
              </Button>
            </Form>
          </TabPane>
        </TabContent>
      ) : null}
    </>
  );
};

AnswerTestRequestForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
};

export default withTranslation()(AnswerTestRequestForm);
