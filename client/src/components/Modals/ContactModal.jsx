import {Button, Modal, ModalBody} from "reactstrap";
import React, {useState} from "react";
import PropTypes from "prop-types";
import {withTranslation} from "react-i18next";
import ContactForm from "../Forms/ContactForm";
import userServices from "../../services/user.services";
import ModalFooter from "reactstrap/es/ModalFooter";
import {toast} from "react-toastify";

const ContactModal = ({onToggle, isOpen, user, t}) => {

    const [loading, setLoading] = useState(false);

    const handleSubmit = ({name, email, message}) => {
        setLoading(true);
        console.log(name, email, message)
        userServices.sendContactUsMessage(name, email, message)
            .then(() => {
                toast.success(t("YOUR_MESSAGE_HAS_BEEN_SENT"))
            })
            .catch(e => toast.error(e.message))
            .finally(() => {
                onToggle();
                setLoading(false);
            });
    }

    const defaultValues = user === undefined ? undefined : {name: user.name, email: user.email, message: ""};

    return (
        <Modal className="modal-dialog-centered " isOpen={isOpen} toggle={onToggle} size="lg">
            <div className="modal-header bg-secondary">
                <h3 className="m-0">Nous contacter</h3>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={onToggle}>
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <ModalBody className="bg-secondary">
                <ContactForm loading={loading} onSubmit={handleSubmit} defaultValues={defaultValues}/>
            </ModalBody>
            <ModalFooter className="bg-secondary">
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
                    Annuler
                </Button>
            </ModalFooter>
        </Modal>
    )
};

ContactModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired
    })
};

export default withTranslation()(ContactModal);