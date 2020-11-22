import React, {useState} from "react";
// reactstrap components
import {
    Button,
    Modal,
    Form,
    FormGroup,
    Input
} from "reactstrap";
import {withTranslation} from "react-i18next";
import Loading from "../Loading";
import PropTypes from "prop-types";
import testServices from "../../services/test.services";
import {toast} from "react-toastify";

//import PropTypes from 'prop-types';

const CancelTestRequestModal = ({testId, t, onClose, isOpen}) => {

    const [cancelReason, setCancelReason] = useState("");
    const [loadingPromise, setLoadingPromise] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        const statuses = await testServices.getTestStatuses();
        const loadingPromise = testServices.updateStatus(testId, statuses['requestCancelled'],
            {cancelRequestReason: cancelReason}
        );
        setLoadingPromise(loadingPromise);
        await loadingPromise.then(() => {
            testServices.testsSubject.next();
            toast.success(t("TEST_REQUEST_CANCELLED"));
            onClose();
        });
    };
    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onClose}>
            <Loading promise={loadingPromise}/>
            <Form role="form" onSubmit={onSubmit}>
                <div className="modal-header bg-secondary">
                    <h4 className="modal-title" id="exampleModalLabel">
                        {t("CANCEL_TEST_REQUEST")}
                    </h4>
                    <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                            onClick={onClose}>
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body white-space-pre-line bg-secondary">
                    <FormGroup className="mb-3">
                        <Input placeholder={t("EXPLAIN_TEST_REQUEST_CANCELLATION")}
                               type="textarea" className="form-control-alternative" name="cancelReason" rows={5}
                               value={cancelReason} onChange={e => setCancelReason(e.target.value)} required/>
                    </FormGroup>
                </div>
                <div className="modal-footer bg-secondary ">
                    <Button color="secondary" data-dismiss="modal" type="button" onClick={onClose}>
                        {t("CLOSE")}
                    </Button>
                    <Button color="danger" data-dismiss="modal" type="submit" disabled={!cancelReason}>
                        {t("CANCEL")}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

CancelTestRequestModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    testId: PropTypes.string.isRequired
};

export default withTranslation()(CancelTestRequestModal);