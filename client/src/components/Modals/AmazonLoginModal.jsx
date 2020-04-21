import {Button, Modal} from "reactstrap";
import React from "react";
import PropTypes from "prop-types";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import AmazonLoginButton from "../Buttons/AmazonLoginButton";
import Label from "reactstrap/es/Label";
import {getAmazonProfileUrl} from "../../helpers/urlHelpers";

const AmazonLoginModal = props => {

    const {isOpen, toggleModal, amazonId} = props;

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={toggleModal}>
            <div className="modal-header">
                <h2 className="modal-title">Compte Amazon</h2>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={toggleModal}>
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body pb-0 text-center">
                <div className="p-2 rounded bg-secondary shadow">
                    <Label>Compte actuel</Label>
                    <a href={getAmazonProfileUrl(amazonId)} target="_blank">{amazonId}</a>
                </div>
                <div className="mt-3">
                    <AmazonLoginButton type='switch'/>
                </div>
                <div className="mt-3">
                    <AmazonLoginButton type='logout'/>
                </div>
            </div>
            <div className="modal-footer">
                <Button color="secondary" data-dismiss="modal" type="button" onClick={toggleModal}>
                    Fermer
                </Button>
            </div>
        </Modal>
    )
};

AmazonLoginModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    amazonId: PropTypes.string.isRequired
};

export default AmazonLoginModal;