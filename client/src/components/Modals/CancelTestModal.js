import PropTypes from "prop-types";
import {Button, Modal} from "reactstrap";
import Loading from "../Loading";
import Form from "reactstrap/es/Form";
import ModalBody from "reactstrap/es/ModalBody";
import FormGroup from "reactstrap/es/FormGroup";
import Label from "reactstrap/lib/Label";
import Input from "reactstrap/es/Input";
import Alert from "reactstrap/es/Alert";
import ModalFooter from "reactstrap/es/ModalFooter";
import React, {useEffect, useRef, useState} from "react";
import testServices from "../../services/test.services";
import {withTranslation} from "react-i18next";

const CancelTestModal = ({isOpen, onToggle, testId, t}) => {

    const [loading, setLoading] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [statuses, setStatuses] = useState([]);

    const cancelReasonInput = useRef(null);

    useEffect(() => {
        testServices.getTestStatuses().then(setStatuses);
    }, []);

    useEffect(() => {
        if (isOpen && cancelReasonInput.current && 'focus' in cancelReasonInput.current) {
            cancelReasonInput.current.focus();
        }
    }, [isOpen]);

    const onSubmit = async e => {
        e.preventDefault();
        if (!cancelReason) return null;
        setLoading(true);
        try {
            await testServices.updateStatus(testId, statuses['testCancelled'], {cancelReason});
            testServices.testsSubject.next();
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
        onToggle();
    };

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle}>
            <Loading loading={loading}/>
            <Form onSubmit={onSubmit}>
                <div className="modal-header">
                    <h3 className="modal-title mb-0">
                        {t("CANCELLATION_CLAIM")}
                    </h3>
                    <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={onToggle}>
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>

                <ModalBody>
                    <div className="p-3 bg-secondary rounded">
                        <FormGroup>
                            <Label for="declineReviewReason">{t("CANCELLATION_CLAIM_REASON")} *</Label>
                            <Input
                                type="textarea" id="declineReviewReason" required={true}
                                innerRef={cancelReasonInput}
                                className="form-control-alternative" rows={3}
                                onChange={e => setCancelReason(e.target.value)}
                                placeholder={t("EXPLAIN_THE_REASON")}/>
                        </FormGroup>
                        <Alert color="danger" className="white-space-pre-line">
                            {t("CANCELLATION_CONSEQUENCES")}
                        </Alert>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="secondary" data-dismisTs="modal" type="button" onClick={onToggle}>
                        {t("CLOSE")}
                    </Button>
                    <Button type="submit" color='danger' disabled={!cancelReason}>{t("SEND")}</Button>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

CancelTestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    testId: PropTypes.string.isRequired
};

export default withTranslation()(CancelTestModal);