import ModalBody from "reactstrap/es/ModalBody";
import ModalFooter from "reactstrap/es/ModalFooter";
import {Button, Modal} from "reactstrap";
import React from "react";
import PropTypes from "prop-types";
import AnimatedCheck from "../../components/AnimatedCheck";
import {withTranslation} from "react-i18next";

const MessageSentMessage = props => {

    const { isOpen, onToggle, t } = props;

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle}>
            <div className="modal-header">
                <h3 className="modal-title mb-0">
                    {t("MESSAGE_SENT")}
                </h3>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={onToggle}>
                    <span aria-hidden={true}>×</span>
                </button>
            </div>

            <ModalBody>
                <AnimatedCheck/>
                <p className="mb-0 white-space-pre-line">
                    {t("YOUR_MESSAGE_HAS_BEEN_SENT")}
                </p>
            </ModalBody>

            <ModalFooter>
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
                    {t("CLOSE")}
                </Button>
            </ModalFooter>
        </Modal>
    )
};

MessageSentMessage.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired
};

export default withTranslation()(MessageSentMessage);