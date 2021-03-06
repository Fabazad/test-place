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
    Col
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

const Register = props => {

    const { t } = props;

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [password2, setPassword2] = useState(null);
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
        if (password !== password2) {
            toast.error(t("DIFFERENT_PASSWORDS"));
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
            toast.success(t("CHECK_MAIL_SENT"));
            setLoading(false);
        }).catch(() => setLoading(false));
    };

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
                                    <Loading loading={loading}/>
                                    <CardBody className="px-lg-5 py-lg-5">
                                        <div className="text-center mb-4">
                                            <img src={require('assets/img/undraws/register.svg')} alt=""
                                                 className="w-100 mb-3" style={{maxWidth: "150px"}}/>
                                        </div>
                                        <Form role="form" onSubmit={onSubmit}>
                                            <FormGroup className="text-center">
                                                <Label className="text-muted">{t("I_WANT_TO_BE")}</Label>
                                                <RolesSelectInput defaultValue={null} onChange={val => setRole(val)}/>
                                            </FormGroup>
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
                                                        name="password2"
                                                        autoComplete="off"
                                                        onChange={e => setPassword2(e.target.value)}
                                                        required
                                                        data-testid="signin-password2-input"
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
                                            <div className="text-center mt-3">
                                                <Link to='/login'>
                                                    <small className="text-primary">{t("I_ALREADY_HAVE_ACCOUNT")}</small>
                                                </Link>
                                            </div>
                                        </Form>
                                    </CardBody>
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
