import React from "react";
import AnimatedCheck from "../AnimatedCheck";
import {Link} from "react-router-dom";
import {Button, Modal} from "reactstrap";
import PropTypes from "prop-types";

const NewTestModal = (props) => {
    const {isOpen, onToggle} = props;

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle}>
            <div className="modal-header">
                <h2 className="modal-title">Demande de Test acceptée</h2>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={onToggle}>
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body text-center">
                <AnimatedCheck/>
                <p className="mt-5 h4">
                    Votre demande de test a bien été envoyée et acceptée.<br/>
                    Il ne vous reste plus qu'à commander le produit.<br/><br/>
                    Vous pouvez suivre et mette à jour l'état d'avancement de votre test la page&nbsp;
                    <Link to="/dashboard/my-current-tests">Mes Tests en Cours</Link>
                </p>
            </div>
            <div className="modal-footer">
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
                    Fermer
                </Button>
            </div>
        </Modal>
    )
};

NewTestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired
};

export default NewTestModal;