import React from "react";
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
import userService from "services/user.services";
import Loading from "components/Loading";
import {withTranslation} from "react-i18next";

//import PropTypes from 'prop-types';

class ForgottenPasswordModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            exampleModal: false,
            loadingPromise: null
        };
    }

    toggleModal = state => {
        this.setState({
            [state]: !this.state[state]
        });
    };

    handleInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    };

    onSubmit = (e) => {
        const {t} = this.props;
        e.preventDefault();
        const loadingPromise = userService.sendResetPasswordMail(this.state.email)
            .then(() => {
                toast.success(t("EMAIL_HAS_BEEN_SENT"));
                this.setState({email: ''});
                this.toggleModal("exampleModal");
            })
            .catch(() => toast.error("EMAIL_HAS_NOT_BEEN_SENT"));
        this.setState({loadingPromise});
    };

    render() {
        const { t } = this.props;
        return (
            <>
                {/* Button trigger modal */}
                <a
                    className="text-primary"
                    href="#pablo"
                    onClick={() => this.toggleModal("exampleModal")}
                >
                    <small>{t("FORGOTTEN_PASSWORD")} ?</small>
                </a>
                {/* Modal */}
                <Modal
                    className="modal-dialog-centered"
                    isOpen={this.state.exampleModal}
                    toggle={() => this.toggleModal("exampleModal")}
                >
                    <Loading promise={this.state.loadingPromise}/>
                    <Form role="form" onSubmit={this.onSubmit}>
                        <div className="modal-header bg-secondary">
                            <h5 className="modal-title" id="exampleModalLabel">
                                {t("FORGOTTEN_PASSWORD")}
                            </h5>
                            <button
                                aria-label="Close"
                                className="close"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => this.toggleModal("exampleModal")}
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
                                        value={this.state.email}
                                        onChange={this.handleInputChange}
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
                                onClick={() => this.toggleModal("exampleModal")}
                            >
                                {t("CLOSE")}
                            </Button>
                            <Button
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
    }
}

ForgottenPasswordModal.propTypes = {};

export default withTranslation()(ForgottenPasswordModal);