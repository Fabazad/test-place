import {Button, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import React, {useState} from "react";
import Loading from "../Loading";
import userServices from "../../services/user.services";
import PropTypes from "prop-types";
import {withTranslation} from "react-i18next";
import ConfirmButton from "../Buttons/ConfirmButton";
import SocialLogin from "../SocialLogin";

const LoginForm = props => {

    const {onLogin, t} = props;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [keepConnection, setKeepConnection] = useState(false);

    const onSubmit = e => {
        e.preventDefault();
        setLoading(true);
        userServices.login(email, password, keepConnection)
            .then(res => {
                if (res && res.user) onLogin();
            })
            .catch(() => setPassword(''))
            .finally(() => setLoading(false));
    };

    const validForm = email && password;

    return (
        <Form role="form" onSubmit={onSubmit}>
            <SocialLogin className="mt-3">Connectez vous avec</SocialLogin>
            <Loading loading={loading}/>
            <div className="text-muted text-center my-3">
                <small>Ou avec vos identifiants</small>
            </div>
            <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-email-83"/>
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Email" type="email" name="email" defaultValue={email}
                           onChange={e => setEmail(e.target.value)} data-testid="login-email-input" required
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
                    <Input placeholder={t("PASSWORD")} type="password" name="password" autoComplete="off"
                           value={password} onChange={e => setPassword(e.target.value)}
                           data-testid="login-password-input" required
                    />
                </InputGroup>
            </FormGroup>
            <div className="custom-control custom-control-alternative custom-checkbox">
                <input className="custom-control-input" id="customCheckLogin" type="checkbox"
                       onChange={e => setKeepConnection(e.target.checked)}/>
                <label className="custom-control-label" htmlFor="customCheckLogin">
                    <span>{t("REMIND_ME")}</span>
                </label>
            </div>
            <div className="text-center">
                <Button className="mt-4" color="primary" type="submit" disabled={!validForm}>
                    {t("LOGIN")}
                </Button>
            </div>
        </Form>
    )
};

LoginForm.propTypes = {
    onLogin: PropTypes.func.isRequired
};

export default withTranslation()(LoginForm);