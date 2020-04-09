import PropTypes from "prop-types";
import Alert from "reactstrap/es/Alert";
import {Button, Modal} from "reactstrap";
import React from "react";
import testServices from "../../services/test.services";
import {toast} from "react-toastify";

const ProductReceivedModal = props => {

    const {isOpen, onToggle, testId} = props;

    const handleConfirm = () => {
        testServices.productReceived(testId)
            .then(() => {
                testServices.testsSubject.next();
                onToggle();
                toast.success("Produit enregistré comme reçu.")
            })
    };

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle}>
            <div className="modal-header">
                <h2 className="modal-title">Produit reçu</h2>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={onToggle}>
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body text-center pb-0">
                <Alert className="alert-info">
                    Vous êtes sur le point de confirmer que vous avez bien reçu le produit chez vous et que vous êtes donc en sa possession.
                </Alert>
            </div>
            <div className="modal-footer">
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
                    Fermer
                </Button>
                <Button color="primary" onClick={handleConfirm}>Confirmer</Button>
            </div>
        </Modal>
    )
};

ProductReceivedModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    testId: PropTypes.string.isRequired
};

export default ProductReceivedModal;