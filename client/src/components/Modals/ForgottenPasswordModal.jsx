import React, {useState} from "react";
// reactstrap components
import {
    Button,
    Modal,
    Form,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input
} from "reactstrap";
import {toast} from "react-toastify";
import {withTranslation} from "react-i18next";
import Loading from "../Loading";
import userServices from '../../services/user.services';

//import PropTypes from 'prop-types';

const ForgottenPasswordModal = ({t}) => {

    const [email, setEmail] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [loadingPromise, setLoadingPromise] = useState(null);

    const toggleModal = () => setIsOpen(!isOpen);

    const onSubmit = (e) => {
        e.preventDefault();
        const loadingPromise = userServices.sendResetPasswordMail(email)
            .then(() => {
                toast.success(t("EMAIL_HAS_BEEN_SENT"));
                setEmail("");
                toggleModal();
            })
            .catch(() => toast.error("EMAIL_HAS_NOT_BEEN_SENT"));
        setLoadingPromise(loadingPromise);
    };
    return (
        <>
            {/* Button trigger modal */}
            <a className="text-primary cursor-pointer" onClick={toggleModal}>
                <small>{t("FORGOTTEN_PASSWORD")} ?</small>
            </a>
            {/* Modal */}
            <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={toggleModal}>
                <Loading promise={loadingPromise}/>
                <Form role="form" onSubmit={onSubmit}>
                    <div className="modal-header bg-secondary">
                        <h5 className="modal-title" id="exampleModalLabel">
                            {t("FORGOTTEN_PASSWORD")}
                        </h5>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={toggleModal}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body white-space-pre-line bg-secondary">
                        <FormGroup className="mb-3">
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="ni ni-email-83"/>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    placeholder={t("ACCOUNT_EMAIL")}
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </InputGroup>
                        </FormGroup>
                    </div>
                    <div className="modal-footer bg-secondary ">
                        <Button
                            color="secondary"
                            data-dismiss="modal"
                            type="button"
                            onClick={toggleModal}
                        >
                            {t("CLOSE")}
                        </Button>
                        <Button
                            disabled={!email}
                            color="primary"
                            data-dismiss="modal"
                            type="submit"
                        >
                            {t("SEND")}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default withTranslation()(ForgottenPasswordModal);