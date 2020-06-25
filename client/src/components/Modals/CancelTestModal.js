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

const CancelTestModal = ({isOpen, onToggle, testId}) => {

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
                        Annulation / Réclamation
                    </h3>
                    <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={onToggle}>
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>

                <ModalBody>
                    <div className="p-3 bg-secondary rounded">
                        <FormGroup>
                            <Label for="declineReviewReason">Raison de l'annulation ou de la réclamation :</Label>
                            <Input
                                type="textarea" id="declineReviewReason" required={true}
                                innerRef={cancelReasonInput}
                                className="form-control-alternative" rows={3}
                                onChange={e => setCancelReason(e.target.value)}
                                placeholder="Expliquez la raison."/>
                        </FormGroup>
                        <Alert color="danger">
                            En refusant, vous allez créer un litige sur ce Test.<br/>
                            Un administrateur s'occupera donc de vérifier si la raison est valable.<br/>
                            Vous serez informé de la suite des évènements par mail.
                        </Alert>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="secondary" data-dismisTs="modal" type="button" onClick={onToggle}>
                        Fermer
                    </Button>
                    <Button type="submit" color='danger' disabled={!cancelReason}>Envoyer</Button>
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

export default CancelTestModal;