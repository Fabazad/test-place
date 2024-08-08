import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { withTranslation } from "react-i18next";
import { Button, Modal } from "reactstrap";
import Alert from "reactstrap/es/Alert";
import Form from "reactstrap/es/Form";
import FormGroup from "reactstrap/es/FormGroup";
import Input from "reactstrap/es/Input";
import ModalBody from "reactstrap/es/ModalBody";
import ModalFooter from "reactstrap/es/ModalFooter";
import Label from "reactstrap/lib/Label";
import { TestStatus } from "../../helpers/constants";
import testServices from "../../services/test.services";
import Loading from "../Loading";

const DeclineReviewModal = (props) => {
  const { isOpen, onToggle, testId, t } = props;

  const [declineReviewReason, setDeclineReviewReason] = useState("");
  const [loading, setLoading] = useState(false);

  const declineReviewReasonInput = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!declineReviewReason) return null;
    setLoading(true);
    try {
      await testServices.updateStatus(testId, TestStatus.REQUEST_DECLINED, {
        declineReviewReason,
      });
      testServices.testsSubject.next();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    onToggle();
  };

  useEffect(() => {
    if (
      isOpen &&
      declineReviewReasonInput.current &&
      "focus" in declineReviewReasonInput.current
    ) {
      declineReviewReasonInput.current.focus();
    }
  }, [isOpen]);

  return (
    <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle}>
      <Loading loading={loading} />
      <Form onSubmit={onSubmit}>
        <div className="modal-header">
          <h3 className="modal-title mb-0">{t("DECLINE_REVIEW")}</h3>
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
          <div className="p-3 bg-secondary rounded">
            <FormGroup>
              <Label for="declineReviewReason">{t("DECLINE_REASON")} *</Label>
              <Input
                type="textarea"
                id="declineReviewReason"
                required={true}
                innerRef={declineReviewReasonInput}
                className="form-control-alternative"
                rows={3}
                onChange={(e) => setDeclineReviewReason(e.target.value)}
                placeholder={t("EXPLAIN_DECLINE_REASON")}
              />
            </FormGroup>
            <Alert color="warning" className="white-space-pre-line">
              {t("DECLINE_REVIEW_CONSEQUENCES")}
            </Alert>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
            {t("CLOSE")}
          </Button>
          <Button type="submit" color="danger" disabled={!declineReviewReason}>
            {t("DECLINE_REVIEW")}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

DeclineReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
};

export default withTranslation()(DeclineReviewModal);
