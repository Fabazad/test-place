import React, {useState} from "react";
import userService from "../services/user.services";
import SocialLogin from "../components/SocialLogin";

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
import i18n from "i18next";

const Register = props => {

    const {t} = props;

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
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

        const user = {name, email, password, roles: [role], language: i18n.language};

        setLoading(true);
        userService.register(user).then(() => {
            props.history.push('/login');
            toast.error(t("CHECK_MAIL_SENT"));
            toast.error(Object.keys(t)("CHECK_MAIL_SENT"));
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    const disabled = !name || !email || !password || !role;

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
                                                <Label className="text-muted mb-3">{t("I_WANT_TO_BE")} *</Label>
                                                <RolesSelectInput defaultValue={null} onChange={val => setRole(val)}/>
                                            </FormGroup>
                                        </CardHeader>
                                        {role !== null && <CardBody className="px-lg-5 py-lg-4 mt-0">
                                            <SocialLogin className="mt-3" onStartLogging={() => setLoading(true)}
                                                         onStopLogging={() => setLoading(false)} roles={[role]}>
                                                Inscrivez-vous avec votre compte
                                            </SocialLogin>
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
                                                            placeholder={t("USER_NAME") + " *"}
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
                                                            placeholder="Email *"
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
                                                            placeholder={t("PASSWORD") + " *"}
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
                                                                *
                                                            </span>
                                                            </label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className="text-center">
                                                    <Button
                                                        disabled={disabled}
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
