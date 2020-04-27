import React, {useState} from "react";
import {Button, Input, Modal} from "reactstrap";
import Form from "reactstrap/es/Form";
import PropTypes from "prop-types";
import FormGroup from "reactstrap/es/FormGroup";
import InfoPopover from "../InfoPopover";
import userService from "../../services/user.services";
import Loading from "../Loading";
import Alert from "reactstrap/es/Alert";

const TesterInfoModal = props => {

    const {isOpen, toggleModal, onSave} = props;

    const user = userService.currentUser;

    const [paypalEmail, setPaypalEmail] = useState(user.paypalEmail);
    const [amazonId, setAmazonId] = useState(user.amazonId);
    const [loading, setLoading] = useState(false);

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        await userService.updateUserInfo(user._id, {
            paypalEmail,
            amazonId: amazonId.replace(/.*(amzn1\.account\.[A-Z0-9]{28}).*/, "$1")
        });
        setLoading(false);
        onSave();
        toggleModal();
    };

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={toggleModal}>
            <Form onSubmit={onSubmit}>
                <div className="modal-header">
                    <h2 className="modal-title">Informations Testeur</h2>
                    <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                            onClick={toggleModal}>
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body pb-0">
                    <Loading loading={loading}/>
                    <Alert color="info" className="mb-4">
                        Avant de devenir Testeur, veuillez remplir ces informations.
                    </Alert>
                    <FormGroup>
                        <label className="form-control-label" htmlFor="input-paypal-email">
                            Adresse mail Paypal
                            <InfoPopover className="ml-3">
                                L'adresse mail Paypal est utilisée par les vendeurs pour vous rembourser sur votre compte Paypal.
                            </InfoPopover>
                        </label>
                        <Input className="form-control-alternative"
                               placeholder="exemple@email.com"
                               defaultValue={user.paypalEmail}
                               onChange={e => setPaypalEmail(e.target.value)}
                               id="input-paypal-email"
                               type={"email"}
                               required
                        />
                    </FormGroup>
                    <FormGroup>
                        <label className="form-control-label" htmlFor="input-amazon-id">
                            Identifiant Amazon
                            <InfoPopover className="ml-3">
                                Pour trouver votre identifiant Amazon, allez premièrement sur la page Amazon:<br/>
                                <a href="https://www.amazon.fr/gp/profile" target="_blank">www.amazon.fr/gp/profile</a>.<br/><br/>
                                Connectez vous si vous ne l'êtes pas.<br/><br/>
                                Copiez collez dans le champ suivant l'url de la page obtenue.<br/><br/>
                                Ou bien seulement la fin de l'url correspondant à votre identifiant : amzn1.account.XXXXXXXXXXXXXXXXXXXXXXXXXXXX.
                            </InfoPopover>
                        </label>
                        <Input className="form-control-alternative"
                               placeholder="amzn1.account.AHANP57CG4WHEOPW64THE75XXXXX"
                               defaultValue={user.amazonId}
                               onChange={e => setAmazonId(e.target.value)}
                               id="input-amazon-id"
                               required
                        />
                    </FormGroup>
                </div>
                <div className="modal-footer">
                    <Button color="secondary" data-dismiss="modal" type="button" onClick={toggleModal}>
                        Fermer
                    </Button>
                    <Button color="primary" type="submit">Enregistrer</Button>
                </div>
            </Form>
        </Modal>
    );
};

TesterInfoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default TesterInfoModal;