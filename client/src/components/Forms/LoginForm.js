import {Button, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import React, {useState} from "react";
import Loading from "../Loading";
import userServices from "../../services/user.services";
import PropTypes from "prop-types";
import {withTranslation} from "react-i18next";
import ConfirmButton from "../Buttons/ConfirmButton";

const LoginForm = props => {

    const { onLogin, t} = props;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [keepConnection, setKeepConnection] = useState(false);

    const onSubmit = e => {
        e.preventDefault();
        setLoading(true);
        userServices.login(email, password, keepConnection).then(res => {
            setLoading(false);
            if (res && res.user) {
                onLogin();
            }
        }).catch(() => {
            setLoading(false);
            setPassword('');
        });
    };

    return (
        <Form role="form" onSubmit={onSubmit}>
            <Loading loading={loading}/>
            <div className="w-100 text-center mb-4">
                <img src={require('assets/img/undraws/authentication.svg')} alt="" className="w-100"
                     style={{maxWidth: "150px"}}/>
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
                <Button className="mt-4" color="primary" type="submit">
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