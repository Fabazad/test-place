import PropTypes from "prop-types";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Button, Col } from "reactstrap";
import confirmHelper from "../../../helpers/confirmHelper";
import constants, { TestStatus } from "../../../helpers/constants";
import { isTestStatus } from "../../../helpers/isTestStatus";
import { getAmazonReviewUrl } from "../../../helpers/urlHelpers";
import testServices from "../../../services/test.services";
import CancelTestModal from "../CancelTestModal";
import CancelTestRequestModal from "../CancelTestRequestModal";
import DeclineReviewModal from "../DeclineReviewModal";
import OrderedProductModal from "../OrderedProductModal";
import ProductReviewedModal from "../ProductReviewedModal";

const { USER_ROLES } = constants;

const TestActions = ({ test, userRole, onToggle, t }) => {
  const [isCancelRequestModalOpen, setIsCancelRequestModalOpen] = useState(false);
  const toggleCancelRequestModal = () => {
    setIsCancelRequestModalOpen(!isCancelRequestModalOpen);
  };

  const [isCancelTestModalOpen, setIsCancelTestModalOpen] = useState(false);
  const toggleCancelTestModal = () => {
    setIsCancelTestModalOpen(!isCancelTestModalOpen);
  };

  const [isOrderedProductModalOpen, setIsOrderedProductModalOpen] = useState(false);
  const toggleOrderedProductModal = () => {
    setIsOrderedProductModalOpen(!isOrderedProductModalOpen);
  };

  const [isProductReviewedModalOpen, setIsProductReviewedModalOpen] = useState(false);
  const toggleProductReviewedModal = () => {
    setIsProductReviewedModalOpen(!isProductReviewedModalOpen);
  };

  const [isDeclineReviewModalOpen, setIsDeclineReviewModalOpen] = useState(false);
  const toggleDeclineReviewModal = () => {
    setIsDeclineReviewModalOpen(!isDeclineReviewModalOpen);
  };

  const confirmReceivedProduct = () => {
    confirmHelper.confirm(t("PRODUCT_RECEIVED_TEXT"), async () => {
      try {
        await testServices.updateStatus(test._id, TestStatus.PRODUCT_RECEIVED);
        testServices.testsSubject.next();
        onToggle();
        toast.success(t("PRODUCT_RECEIVED_TEXT_SUCCESS_TEXT"));
      } catch (e) {
        toast.error(e.message);
      }
    });
  };

  const confirmValidateReview = () => {
    confirmHelper.confirm(t("REVIEW_VALIDATED_TEXT"), async () => {
      try {
        await testServices.updateStatus(test._id, TestStatus.REVIEW_VALIDATED);
        testServices.testsSubject.next();
        onToggle();
        toast.success(t("REVIEW_VALIDATED_SUCCESS_TEXT"));
      } catch (e) {
        toast.error(e.message);
      }
    });
  };

  const confirmMoneyReceived = () => {
    confirmHelper.confirm(t("MONEY_RECEIVED_TEXT"), async () => {
      try {
        await testServices.updateStatus(test._id, TestStatus.MONEY_RECEIVED);
        testServices.testsSubject.next();
        onToggle();
        toast.success(t("MONEY_RECEIVED_SUCCESS_TEXT"));
      } catch (e) {
        toast.error(e.message);
      }
    });
  };

  const confirmMoneySent = () => {
    confirmHelper.confirm(t("MONEY_SENT_TEXT"), async () => {
      try {
        await testServices.updateStatus(test._id, TestStatus.MONEY_SENT);
        testServices.testsSubject.next();
        onToggle();
        toast.success(t("MONEY_SENT_SUCCESS_TEXT"));
      } catch (e) {
        toast.error(e.message);
      }
    });
  };

  const isStatus = (statusesToCheck) => isTestStatus({ statusesToCheck, test });

  const CancelButton = () => (
    <>
      <Button color="danger" onClick={toggleCancelTestModal}>
        <i className="fa fa-times mr-3" />
        {t("CANCEL_TEST")}
      </Button>
      <CancelTestModal
        isOpen={isCancelTestModalOpen}
        onToggle={toggleCancelTestModal}
        testId={test._id}
        onCancel={onToggle}
      />
    </>
  );

  const MoneyReceivedButton = () => (
    <Button color="success" onClick={confirmMoneyReceived}>
      <i className="fa fa-dollar-sign mr-3" />
      {t("MONEY_RECEIVED")}
    </Button>
  );

  const Content = () => {
    if (userRole === USER_ROLES.TESTER && isStatus(TestStatus.REQUESTED)) {
      return (
        <Col xs={12}>
          <Button color="danger" onClick={toggleCancelRequestModal}>
            <i className="fa fa-times mr-3" />
            {t("CANCEL_TEST_REQUEST")}
          </Button>
          <CancelTestRequestModal
            testId={test._id}
            isOpen={isCancelRequestModalOpen}
            onClose={toggleCancelRequestModal}
            onCancel={onToggle}
          />
        </Col>
      );
    }
    if (
      (userRole === USER_ROLES.SELLER &&
        isStatus([
          TestStatus.REQUEST_ACCEPTED,
          TestStatus.PRODUCT_ORDERED,
          TestStatus.PRODUCT_RECEIVED,
          TestStatus.MONEY_SENT,
        ])) ||
      (userRole === USER_ROLES.TESTER && isStatus(TestStatus.PRODUCT_REVIEWED))
    ) {
      return <CancelButton />;
    }
    if (userRole === USER_ROLES.TESTER && isStatus(TestStatus.REQUEST_ACCEPTED)) {
      return (
        <>
          <div>
            <CancelButton />
          </div>
          <div>
            <Button
              color="default"
              onClick={() => window.open(test.product.amazonUrl, "_blank")}
            >
              <i className="fab fa-amazon mr-3" />
              {t("BUY_PRODUCT")}
            </Button>
          </div>
          <div>
            <Button color="warning" onClick={toggleOrderedProductModal}>
              <i className="fa fa-shopping-cart mr-3" />
              {t("PRODUCT_ORDERED")}
            </Button>
            <OrderedProductModal
              testId={test._id}
              onToggle={toggleOrderedProductModal}
              isOpen={isOrderedProductModalOpen}
              onOrdered={onToggle}
            />
          </div>
        </>
      );
    }
    if (userRole === USER_ROLES.TESTER && isStatus(TestStatus.PRODUCT_ORDERED)) {
      return (
        <>
          <div>
            <CancelButton />
          </div>
          <div>
            <Button color="warning" onClick={confirmReceivedProduct}>
              <i className="fa fa-box-open mr-3" />
              {t("PRODUCT_RECEIVED")}
            </Button>
          </div>
        </>
      );
    }
    if (userRole === USER_ROLES.TESTER && isStatus(TestStatus.PRODUCT_RECEIVED)) {
      return (
        <>
          <div>
            <CancelButton />
          </div>
          <div>
            <Button color="warning" onClick={toggleProductReviewedModal}>
              <i className="fa fa-star mr-3" />
              {t("PRODUCT_REVIEWED")}
            </Button>
            <ProductReviewedModal
              isOpen={isProductReviewedModalOpen}
              onToggle={toggleProductReviewedModal}
              onReviewed={onToggle}
              testId={test._id}
            />
          </div>
        </>
      );
    }
    if (userRole === USER_ROLES.SELLER && isStatus(TestStatus.PRODUCT_REVIEWED)) {
      return (
        <>
          <div>
            <CancelButton />
          </div>
          <div>
            <Button
              color="default"
              onClick={() => window.open(getAmazonReviewUrl(test.reviewId), "_blank")}
            >
              <i className="fab fa-amazon mr-3" />
              {t("REVIEW_LINK")}
            </Button>
          </div>
          <div>
            <Button color="danger" onClick={toggleDeclineReviewModal}>
              <i className="fa fa-thumbs-down mr-3" />
              {t("DECLINE_REVIEW")}
            </Button>
            <DeclineReviewModal
              isOpen={isDeclineReviewModalOpen}
              onToggle={toggleDeclineReviewModal}
              testId={test._id}
              onDeclined={onToggle}
            />
          </div>
          <div>
            <Button color="success" onClick={confirmValidateReview}>
              <i className="fa fa-thumbs-up mr-3" />
              {t("VALIDATE_REVIEW")}
            </Button>
          </div>
        </>
      );
    }
    if (
      userRole === USER_ROLES.TESTER &&
      isStatus([TestStatus.REVIEW_VALIDATED, TestStatus.MONEY_SENT])
    ) {
      return (
        <>
          <div>
            <CancelButton />
          </div>
          <div>
            <MoneyReceivedButton />
          </div>
        </>
      );
    }
    if (userRole === USER_ROLES.SELLER && isStatus(TestStatus.REVIEW_VALIDATED)) {
      return (
        <>
          <div>
            <CancelButton />
          </div>
          <div>
            <Button color="success" onClick={confirmMoneySent}>
              <i className="fa fa-dollar-sign mr-3" />
              {t("MONEY_SENT")}
            </Button>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="mt-3 justify-content-center d-flex flex-wrap" style={{ gap: "1rem" }}>
      <Content />
    </div>
  );
};

TestActions.propTypes = {
  test: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default withTranslation()(TestActions);
