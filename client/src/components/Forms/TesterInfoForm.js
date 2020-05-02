import Loading from "../Loading";
import FormGroup from "reactstrap/es/FormGroup";
import InfoPopover from "../InfoPopover";
import {Button, Input} from "reactstrap";
import Form from "reactstrap/es/Form";
import React, {useState} from "react";
import userService from "../../services/user.services";
import PropTypes from "prop-types";
import constants from "../../helpers/constants";
const {USER_ROLES} = constants;

const TesterInfoForm = props => {

    const btnText = props.btnText ? props.btnText : "Enregistrer";
    const user = userService.currentUser;

    const [paypalEmail, setPaypalEmail] = useState(user.paypalEmail);
    const [amazonId, setAmazonId] = useState(user.amazonId);
    const [loading, setLoading] = useState(false);

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        userService.updateUserInfo(user._id, {
            paypalEmail,
            amazonId: amazonId.replace(/.*(amzn1\.account\.[A-Z0-9]{28}).*/, "$1"),
            roles: user.roles.concat([USER_ROLES.TESTER])
        })
            .then(() => {
                setLoading(false);
                props.onSaved();
            })
            .catch(() => setLoading(false));
    };

    return (
        <Form onSubmit={onSubmit}>
            <Loading loading={loading}/>
            <FormGroup>
                <label className="form-control-label" htmlFor="input-paypal-email">
                    Adresse mail Paypal
                    <InfoPopover className="ml-3">
                        L'adresse mail Paypal est utilisée par les vendeurs pour vous rembourser sur votre compte
                        Paypal.
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
                        Ou bien seulement la fin de l'url correspondant à votre identifiant :
                        amzn1.account.XXXXXXXXXXXXXXXXXXXXXXXXXXXX.
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
            <FormGroup className="text-center mb-0">
                <Button type="submit" color="primary">{btnText}</Button>
            </FormGroup>
        </Form>
    )
};

TesterInfoForm.propTypes = {
    onSaved: PropTypes.func.isRequired,
    btnText: PropTypes.string
};

export default TesterInfoForm;