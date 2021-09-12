import React, {useState} from "react";
import userService from "../services/user.services";

// reactstrap components
import {
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Container,
    Row,
    Col,
    CardHeader, CardFooter
} from "reactstrap";

import {Link} from 'react-router-dom';

// core components
import SimpleFooter from "../components/Footers/SimpleFooter.jsx";
import {toast} from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import PasswordStrength from "../components/PasswordStrength";
import Loading from "../components/Loading";
import PrivacyPolicyModal from "../components/Modals/PrivacyPolicyModal";
import RolesSelectInput from "../components/Forms/RolesSelectInput";
import Label from "reactstrap/es/Label";
import {withTranslation} from "react-i18next";
import GoogleLoginButton from "../components/Buttons/GoogleLoginButton";
import FacebookLoginButton from "../components/Buttons/FacebookLoginButton";
import constants from "../helpers/constants";

const {USER_ROLES} = constants

const Register = props => {

    const {t} = props;

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [captcha, setCaptcha] = useState(null);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState(null);

    const onSubmit = (event) => {
        event.preventDefault();

        if (!role) {
            toast.error(t("INDICATE_TESTER_OR_SELLER"));
            return;
        }

        if (password.length < 8) {
            toast.error(t("PASSWORD_SHOULD_MIN_CHARS"));
            return;
        }
        if (!captcha) {
            toast.error(t("CHECK_YOUR_HUMAN"));
            return;
        }

        const user = {name, email, password, captcha, roles: [role]};

        setLoading(true);
        userService.register(user).then(() => {
            props.history.push('/login');
            toast.error(t("CHECK_MAIL_SENT"));
            toast.error(Object.keys(t)("CHECK_MAIL_SENT"));
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    const onGoogleSignInSuccess = async (res) => {
        const {profileObj} = res;
        const {email, givenName, googleId, name} = profileObj;

        const builtName = (givenName || name) + Math.round(Math.random() * 10000)
        const user = {name: builtName, email, roles: [role], googleId};

        setLoading(true);
        try {
            await userService.googleRegister(user);
            props.history.push(role === USER_ROLES.SELLER ? '/dashboard/my-products' : '/');
        } finally {
            setLoading(false);
        }
    }

    const onGoogleSignInFail = (res) => {
        toast.error(res);
        toast.error(Object.keys(res));
    }

    const onFacebookSignInSuccess = (res) => {
        console.log(res)
    }

    const onFacebookSignInFail = (res) => {
        toast.error(res);
        toast.error(Object.keys(res));
    }

    return (
        <>
            <main>
                <section className="section section-shaped section-lg">
                    <div className="shape shape-style-1 bg-gradient-default">
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                    </div>
                    <Container className="pt-lg-md">
                        <Row className="justify-content-center">
                            <Col lg="5">
                                <Card className="bg-secondary shadow border-0">

                                    <Form role="form" onSubmit={onSubmit}>
                                        <Loading loading={loading}/>
                                        <CardHeader>
                                            <FormGroup className="text-center">
                                                <Label className="text-muted mb-3">{t("I_WANT_TO_BE")}</Label>
                                                <RolesSelectInput defaultValue={null} onChange={val => setRole(val)}/>
                                            </FormGroup>
                                        </CardHeader>
                                        {role !== null && <CardBody className="px-lg-5 py-lg-4 mt-0">
                                            <div className="mb-3">
                                                <div className="text-muted text-center mb-3">
                                                    <small>Inscrivez-vous avec votre compte</small>
                                                </div>
                                                <div className="text-center">
                                                    <FacebookLoginButton onSuccess={onFacebookSignInSuccess}
                                                                         onFailure={onFacebookSignInFail}
                                                                         disabled={role === null}/>
                                                    <GoogleLoginButton onSuccess={onGoogleSignInSuccess}
                                                                       onFailure={onGoogleSignInFail}
                                                                       disabled={role === null}/>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <div className="text-muted text-center mb-3">
                                                    <small>Ou avec des identifiants</small>
                                                </div>
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative mb-3">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="ni ni-single-02"/>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input
                                                            placeholder={t("USER_NAME")}
                                                            name="name"
                                                            onChange={e => setName(e.target.value)}
                                                            required
                                                            data-testid="signin-name-input"
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative mb-3">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="ni ni-email-83"/>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input
                                                            placeholder="Email"
                                                            type="email"
                                                            name="email"
                                                            onChange={e => setEmail(e.target.value)}
                                                            required
                                                            data-testid="signin-email-input"
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
                                                            placeholder={t("PASSWORD")}
                                                            type="password"
                                                            name="password"
                                                            autoComplete="off"
                                                            onChange={e => setPassword(e.target.value)}
                                                            required
                                                            data-testid="signin-password-input"
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                                <PasswordStrength min={8} password={password}/>
                                                <div className="text-center mb-3 mt-4">
                                                    <ReCAPTCHA
                                                        sitekey="6LfcE8IUAAAAAIMSa9vEYhqVngqTXbtegnYhGkkH"
                                                        onChange={($event) => setCaptcha($event)}
                                                    />
                                                </div>
                                                <Row className="my-4">
                                                    <Col xs="12">
                                                        <div
                                                            className="custom-control custom-control-alternative custom-checkbox">
                                                            <input
                                                                className="custom-control-input"
                                                                id="customCheckRegister"
                                                                type="checkbox"
                                                                required
                                                                data-testid="signin-agree-input"
                                                            />
                                                            <label className="custom-control-label"
                                                                   htmlFor="customCheckRegister">
                                                            <span>
                                                                {t("I_ACCEPT_THE")}{" "}
                                                                <PrivacyPolicyModal/>
                                                            </span>
                                                            </label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className="text-center">
                                                    <Button
                                                        className="mt-4"
                                                        color="primary"
                                                        type="submit"
                                                        data-testid="signin-submit-button"
                                                    >
                                                        {t("CREATE_MY_ACCOUNT")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardBody>}
                                    </Form>
                                    <CardFooter className="bg-secondary">
                                        <div className="text-center">
                                            <Link to='/login'>
                                                <small
                                                    className="text-primary">{t("I_ALREADY_HAVE_ACCOUNT")}</small>
                                            </Link>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </main>
            <SimpleFooter/>
        </>
    );
};

export default withTranslation()(Register);
