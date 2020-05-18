import ModalBody from "reactstrap/es/ModalBody";
import ModalFooter from "reactstrap/es/ModalFooter";
import {Button, Modal} from "reactstrap";
import React from "react";
import PropTypes from "prop-types";
import AnimatedCheck from "../../components/AnimatedCheck";

const MessageSentMessage = props => {

    const {isOpen, onToggle} = props;

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle}>
            <div className="modal-header">
                <h3 className="modal-title mb-0">
                    Message envoyé !
                </h3>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={onToggle}>
                    <span aria-hidden={true}>×</span>
                </button>
            </div>

            <ModalBody>
                <AnimatedCheck/>
                <p className="mb-0">
                    Votre message a bien été expédié.<br/>
                    Merci, et à très vite !
                </p>
            </ModalBody>

            <ModalFooter>
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
                    Fermer
                </Button>
            </ModalFooter>
        </Modal>
    )
};

MessageSentMessage.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired
};

export default MessageSentMessage;