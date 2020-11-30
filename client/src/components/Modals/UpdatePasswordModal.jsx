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
import userServices from "services/user.services";
import PasswordStrength from "components/PasswordStrength";
import Loading from "components/Loading";
import {withTranslation} from "react-i18next";
import ConfirmButton from "../Buttons/ConfirmButton";
//import PropTypes from 'prop-types';

const UpdatePasswordModal = ({t}) => {

    const [previousPassword, setPreviousPassword] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);

    const onSubmit = (e) => {
        e.preventDefault();
        if (password.length < 8) {
            toast.error(t("PASSWORD_NEEDS_MIN_CHARS"));
            return;
        }
        if (password !== password2) {
            toast.error(t("DIFFERENT_PASSWORDS"));
            return;
        }

        setLoading(true);
        userServices.updatePassword(previousPassword, password)
            .then(() => {
                toast.success(t("PASSWORD_UPDATED"));
                setPreviousPassword('');
                setPassword('');
                setPassword2('');
                toggleModal();
            })
            .catch(() => toast.error(t("PASSWORD_NOT_UPDATED")))
            .finally(() => setLoading(false));
    };

    return (
        <>
            {/* Button trigger modal */}
            <Button color="primary" type="button" onClick={toggleModal}>
                <span>{t("UPDATE_PASSWORD")}</span>
            </Button>
            {/* Modal */}
            <Modal className="modal-dialog-centered" isOpen={isOpen}
                   toggle={toggleModal}>
                <Loading loading={loading}/>
                <Form role="form" onSubmit={onSubmit}>
                    <div className="modal-header bg-secondary">
                        <h4 className="modal-title" id="exampleModalLabel">
                            {t("UPDATE_PASSWORD")}
                        </h4>
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
                        <FormGroup>
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="ni ni-lock-circle-open"/>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    placeholder={t("CURRENT_PASSWORD")}
                                    type="password"
                                    autoComplete="off"
                                    name="previousPassword"
                                    value={previousPassword}
                                    onChange={(e) => setPreviousPassword(e.target.value)}
                                    required
                                />
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="ni ni-lock-circle-open"/>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    placeholder={t("NEW_PASSWORD")}
                                    type="password"
                                    autoComplete="off"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="ni ni-lock-circle-open"/>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    placeholder={t("NEW_PASSWORD")}
                                    type="password"
                                    autoComplete="off"
                                    name="password2"
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
                                    required
                                />
                            </InputGroup>
                        </FormGroup>
                        <PasswordStrength min={8} password={password}/>

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
                        <ConfirmButton color="primary" data-dismiss="modal" type="submit" disabled={!password}>
                            {t("SEND")}
                        </ConfirmButton>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default withTranslation()(UpdatePasswordModal);