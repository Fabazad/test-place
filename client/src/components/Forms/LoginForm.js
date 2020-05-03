import {Button, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import React, {useState} from "react";
import Loading from "../Loading";
import userServices from "../../services/user.services";
import PropTypes from "prop-types";

const LoginForm = props => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();
        setLoading(true);
        userServices.login(email, password).then(res => {
            setLoading(false);
            if (res && res.user) {
                props.onLogin();
            }
        }).catch(() => {
            setLoading(false);
            setPassword('');
        });
    };

    return (
        <Form role="form" onSubmit={onSubmit}>
            <Loading loading={loading}/>
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
                    <Input placeholder="Password" type="password" name="password" autoComplete="off"
                           value={password} onChange={e => setPassword(e.target.value)}
                           data-testid="login-password-input" required
                    />
                </InputGroup>
            </FormGroup>
            <div className="custom-control custom-control-alternative custom-checkbox">
                <input className="custom-control-input" id=" customCheckLogin" type="checkbox"/>
                <label className="custom-control-label" htmlFor=" customCheckLogin">
                    <span>Se souvenir de moi</span>
                </label>
            </div>
            <div className="text-center">
                <Button className="mt-4" color="primary" type="submit" data-testid="submit-login-button">
                    Connexion
                </Button>
            </div>
        </Form>
    )
};

LoginForm.propTypes = {
    onLogin: PropTypes.func.isRequired
};

export default LoginForm;