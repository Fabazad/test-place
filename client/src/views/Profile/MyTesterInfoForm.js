import React, {useState} from 'react';
import Form from "reactstrap/es/Form";
import Loading from "../../components/Loading";
import {Button, FormGroup, Input} from "reactstrap";
import userService from "../../services/user.services";
import InfoPopover from "../../components/InfoPopover";
import {toast} from "react-toastify";
import PropTypes from "prop-types";

const MyTesterInfoForm = props => {

    const {user} = props;

    const [loading, setLoading] = useState(false);
    const [testerMessage, setTesterMessage] = useState(user.testerMessage);
    const [paypalEmail, setPaypalEmail] = useState(user.paypalEmail);
    const [amazonId, setAmazonId] = useState(user.amazonId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        userService.updateUserInfo(userService.currentUser._id, {
            testerMessage,
            paypalEmail,
            amazonId: amazonId.replace(/.*(amzn1\.account\.[A-Z0-9]{28}).*/, "$1")
        })
            .catch(() => setLoading(false))
            .then(() => {
                setLoading(false);
                toast.success("Modifications Enregistrées");
            });
    };

    const disabledSave = user.testerMessage === testerMessage
        && user.paypalEmail === paypalEmail
        && user.amazonId === amazonId;

    return (
        <Form onSubmit={handleSubmit} className="position-relative">
            <Loading loading={loading}/>
            <div>
                <h6 className="heading-small text-muted mb-4 d-inline-block">
                    Mes Informations Testeur
                </h6>
                <Button size="sm" color="info" className="float-right" type="submit"
                        disabled={disabledSave}>
                    Enregister
                </Button>
            </div>
            <div className="pl-lg-4">
                <FormGroup>
                    <label className="form-control-label" htmlFor="input-tester-message">
                        Message Testeur
                        <InfoPopover className="ml-3">
                            Le champ texte <b><i>Message au Vendeur</i></b> à fournir lors
                            d'une demande de test sera pré-rempli avec ce <b><i>Message
                            Testeur</i></b>.
                        </InfoPopover>
                    </label>
                    <Input className="form-control-alternative"
                           defaultValue={user.testerMessage}
                           id="input-tester-message"
                           placeholder={"Bonjour, je suis " + user.name + "..."}
                           type="textarea"
                           onChange={e => setTesterMessage(e.target.value)}
                    />
                </FormGroup>
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
                            <a href="https://www.amazon.fr/gp/profile" target="_blank" rel="noopener noreferrer">
                                www.amazon.fr/gp/profile
                            </a>.<br/><br/>
                            Connectez vous si vous ne l'êtes pas.<br/><br/>
                            Copiez collez dans le champ suivant l'url de la page obtenue.<br/><br/>
                            Ou bien seulement la fin de l'url correspondant à votre identifiant : amzn1.account.XXXXXXXXXXXXXXXXXXXXXXXXXXXX.
                        </InfoPopover>
                    </label>
                    <Input className="form-control-alternative"
                           placeholder="amzn1.account.AHANP57CG4WHEOPW64THE75XXXXX"
                           defaultValue={user.amazonId}
                           onChange={e => setAmazonId(e.target.value)}
                           id="input-amazon-id" required
                    />
                </FormGroup>
            </div>
        </Form>
    );
};

MyTesterInfoForm.propTypes = {
    user: PropTypes.object.isRequired
};

export default MyTesterInfoForm;
