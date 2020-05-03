import React from "react";
import {Button, Input, Modal} from "reactstrap";
import PropTypes from "prop-types";
import TesterInfoForm from "../Forms/TesterInfoForm";
import Alert from "reactstrap/es/Alert";

const TesterInfoModal = props => {

    const {isOpen, toggleModal} = props;

    const onSaved = () => {
        props.onSaved();
        toggleModal();
    };

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={toggleModal}>
            <div className="modal-header">
                <h2 className="modal-title">Informations Testeur</h2>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                        onClick={toggleModal}>
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body pb-0">
                <Alert color="info" className="mb-4">
                    Avant de devenir Testeur, veuillez remplir ces informations.
                </Alert>
                <TesterInfoForm onSaved={onSaved}/>
            </div>
            <div className="modal-footer">
                <Button color="secondary" data-dismiss="modal" type="button" onClick={toggleModal}>
                    Fermer
                </Button>
            </div>
        </Modal>
    );
};

TesterInfoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired
};

export default TesterInfoModal;