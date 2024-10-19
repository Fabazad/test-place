import PropTypes from "prop-types";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Button, Modal } from "reactstrap";
import Alert from "reactstrap/es/Alert";
import Form from "reactstrap/es/Form";
import FormGroup from "reactstrap/es/FormGroup";
import Input from "reactstrap/es/Input";
import ModalBody from "reactstrap/es/ModalBody";
import ModalFooter from "reactstrap/es/ModalFooter";
import Label from "reactstrap/lib/Label";
import { TestStatus } from "../../helpers/constants";
import { getAmazonProfileUrl } from "../../helpers/urlHelpers";
import testServices from "../../services/test.services";
import userServices from "../../services/user.services";
import InfoPopover from "../InfoPopover";
import Loading from "../Loading";

const ProductReviewedModal = ({ isOpen, onToggle, testId, t, onReviewed }) => {
  const [reviewId, setReviewId] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!reviewId) return null;

    setLoading(true);
    try {
      await testServices.updateStatus(testId, TestStatus.PRODUCT_REVIEWED, { reviewId });
      testServices.testsSubject.next();
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
    onToggle();
    onReviewed?.();
    toast.success(t("PRODUCT_SET_AS_REVIEWED"));
  };

  const handleInput = (e) => {
    if (!e.target.value) return;
    const match = e.target.value.match(
      /(?:[/gp/customer\-reviews/]|$)?([A-Z0-9]{13,14})/
    );
    if (!match) setReviewId("");
    else setReviewId(match[1]);
  };

  const currentUser = userServices.currentUser;

  return (
    <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle}>
      <Loading loading={loading} />
      <Form onSubmit={onSubmit}>
        <div className="modal-header">
          <h3 className="modal-title mb-0">{t("PRODUCT_REVIEWED")}</h3>
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
          <Alert color="info" className="white-space-pre-line">
            {t("REVIEW_NEED_VALIDATION")}
          </Alert>
          <div className="p-3 bg-secondary rounded mt-3">
            <FormGroup>
              <Label for="declineReviewReason">{t("REVIEW_LINK")} *</Label>
              <InfoPopover className="ml-3 white-space-pre-line">
                {t("GO_ON_YOUR")}{" "}
                <a
                  href={getAmazonProfileUrl(currentUser.amazonId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("AMAZON_PROFILE")}
                </a>
                .<br />
                {t("COPY_PASTE_YOUR_REVIEW_LINK")}
              </InfoPopover>
              <Input
                type="text"
                id="declineReviewReason"
                required={true}
                className="form-control-alternative"
                onChange={handleInput}
                placeholder="https://www.amazon.fr/gp/customer-reviews/XXXXXXXXXXXXXX"
              />
            </FormGroup>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
            Annuler
          </Button>
          <Button type="submit" color="primary" disabled={!reviewId}>
            {t("SAVE")}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

ProductReviewedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
  onReviewed: PropTypes.func,
};

export default withTranslation()(ProductReviewedModal);
