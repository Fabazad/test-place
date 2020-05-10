import PropTypes from "prop-types";
import ModalBody from "reactstrap/es/ModalBody";
import Label from "reactstrap/lib/Label";
import ModalFooter from "reactstrap/es/ModalFooter";
import {Button, Modal} from "reactstrap";
import React, {useEffect, useRef, useState} from "react";
import Form from "reactstrap/es/Form";
import FormGroup from "reactstrap/es/FormGroup";
import Input from "reactstrap/es/Input";
import Alert from "reactstrap/es/Alert";
import testServices from "../../services/test.services";

const DeclineReviewModal = props => {

    const {isOpen, onToggle, testId} = props;

    const [declineReviewReason, setDeclineReviewReason] = useState("");
    const [statuses, setStatuses] = useState({});

    const declineReviewReasonInput = useRef(null);

    const onSubmit = e => {
        e.preventDefault();
        if (!declineReviewReason) return null;
        testServices.updateStatus(testId, statuses['reviewDeclined'], {declineReviewReason})
            .then(onToggle);
    };

    useEffect(() => {
        testServices.getTestStatuses().then(setStatuses);
    }, []);

    useEffect(() => {
        if (isOpen && declineReviewReasonInput.current && 'focus' in declineReviewReasonInput.current) {
            declineReviewReasonInput.current.focus();
        }
    }, [isOpen]);

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle}>
            <Form onSubmit={onSubmit}>
                <div className="modal-header">
                    <h3 className="modal-title mb-0">
                        Refuser l'avis donné
                    </h3>
                    <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={onToggle}>
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>

                <ModalBody>
                    <div className="p-3 bg-secondary rounded">
                        <FormGroup>
                            <Label for="declineReviewReason">Raison du refus :</Label>
                            <Input
                                type="textarea" id="declineReviewReason" required={true}
                                innerRef={declineReviewReasonInput}
                                className="form-control-alternative" rows={3}
                                onChange={e => setDeclineReviewReason(e.target.value)}
                                placeholder="Expliquez la raison du refus de l'avis."/>
                        </FormGroup>
                        <Alert color="warning">
                            En refusant, vous allez créer un litige sur ce Test.<br/>
                            Un administrateur s'occupera donc de vérifier si la raison est valable.<br/>
                            Si c'est le cas, vous serez totalement rembourser sur la compensation donnée pour cet avis.
                        </Alert>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
                        Fermer
                    </Button>
                    <Button type="submit" color='danger' disabled={!declineReviewReason}>Refuser l'avis</Button>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

DeclineReviewModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    testId: PropTypes.string.isRequired
};

export default DeclineReviewModal;