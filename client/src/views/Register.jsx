import React from "react";
import userService from "services/user.services";

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Container,
    Row,
    Col, UncontrolledPopover, PopoverBody
} from "reactstrap";

import {Link} from 'react-router-dom';

// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import {toast} from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import PasswordStrength from "components/PasswordStrength";
import Loading from "components/Loading";
import SwitchButtons from "components/SwitchButtons";
import PrivacyPolicyModal from "components/Modals/PrivacyPolicyModal";
import AmazonLoginButton from "../components/AmazonLoginButton";

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            password2: '',
            role: '',
            captcha: '',
            loadingPromise: null,
            amazonUrl: ''
        };
    }

    handleInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    };

    onSubmit = (event) => {
        event.preventDefault();
        if (this.state.password.length < 8) {
            toast.error("Le mot de passe doit possèder au moins 8 caractères.");
            return;
        }
        if (this.state.password !== this.state.password2) {
            toast.error("Les deux mots de passe ne sont pas identiques.");
            return;
        }
        if (!this.state.captcha) {
            toast.error("Vérifiez que vous êtes Humain.");
            return;
        }

        const loadingPromise = userService.register(this.state.email, this.state.password, this.state.role, this.state.captcha, this.state.amazonUrl).then(res => {
            this.props.history.push('/login');
            toast.success("Un mail de validation vous a été envoyé.");
        });
        this.setState({loadingPromise});
    };

    componentDidMount() {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        this.refs.main.scrollTop = 0;
    }

    onCaptchaChange(value) {
        this.setState({captcha: value});
    }

    render() {
        return (
            <>
                <main ref="main">
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
                                        <Loading promise={this.state.loadingPromise}/>
                                        <CardHeader className="bg-white pb-5">
                                            <div className="text-muted text-center mb-3">
                                                <small>Sign up with</small>
                                            </div>
                                            <div className="text-center">
                                                <AmazonLoginButton
                                                    provider='amazon'
                                                    appId='amzn1.application-oa2-client.1dc653b5a0d74449b587f561ea23589a'
                                                    onLoginSuccess={(response) => console.log(response)}
                                                    onLoginFailure={(err) => console.log(err)}
                                                >
                                                    <i className="fa fa-amazon size-lg text-yellow"/>
                                                    <span className="btn-inner--text">Amazon</span>
                                                </AmazonLoginButton>
                                            </div>
                                        </CardHeader>
                                        <CardBody className="px-lg-5 py-lg-5">
                                            <div className="text-center text-muted mb-4">
                                                <small>Or sign up with credentials</small>
                                            </div>
                                            <Form role="form" onSubmit={this.onSubmit}>
                                                <div className="mt-3 mb-4">
                                                    <SwitchButtons
                                                        fields={[{
                                                            label: "Testeur",
                                                            value: 'reviewer'
                                                        }, {label: "Vendeur", value: 'seller'}]}
                                                        onChange={this.handleInputChange}
                                                        name="role"
                                                    />
                                                </div>
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative mb-3">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="fa fa-link"/>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input
                                                            placeholder="Lien du Profil Amazon"
                                                            type="text"
                                                            name="amazonUrl"
                                                            value={this.state.amazonUrl}
                                                            onChange={this.handleInputChange}
                                                            required
                                                        />
                                                        <i className="fa fa-question-circle cursor-pointer mx-2 my-auto" id="amazonLinkTooltip"/>
                                                        <UncontrolledPopover
                                                            placement="top"
                                                            target="amazonLinkTooltip"
                                                            className="popover-default w-400px"
                                                        >
                                                            <PopoverBody className="text-center">
                                                                Rendez-vous sur <a href="https://www.amazon.fr/gp/css/homepage.html">amazon.fr/gp/css/homepage.html</a>.<br/>
                                                                Puis dans la rubrique <strong>Commander et préférences d'achats</strong> cliquez sur <strong>Profil</strong>.<br/>
                                                                Copiez puis collez l'adresse URL de la page.
                                                            </PopoverBody>
                                                        </UncontrolledPopover>
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
                                                            value={this.state.email}
                                                            onChange={this.handleInputChange}
                                                            required
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
                                                            placeholder="Password"
                                                            type="password"
                                                            name="password"
                                                            autoComplete="off"
                                                            value={this.state.password}
                                                            onChange={this.handleInputChange}
                                                            required
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
                                                            placeholder="Password"
                                                            type="password"
                                                            name="password2"
                                                            autoComplete="off"
                                                            value={this.state.password2}
                                                            onChange={this.handleInputChange}
                                                            required
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                                <PasswordStrength min={8} password={this.state.password}/>
                                                <div className="text-center mb-3 mt-4">
                                                    <ReCAPTCHA
                                                        sitekey="6LfcE8IUAAAAAIMSa9vEYhqVngqTXbtegnYhGkkH"
                                                        onChange={($event) => this.onCaptchaChange($event)}
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
                                                            />
                                                            <label
                                                                className="custom-control-label"
                                                                htmlFor="customCheckRegister"
                                                            >
                                                                <span>
                                                                  J'accepte les{" "}
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
                                                    >
                                                        Create account
                                                    </Button>
                                                </div>
                                                <div className="text-center mt-3">
                                                    <Link to='/#/login'>
                                                        <small className="text-primary">J'ai déjà un compte</small>
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
    }
}

export default Register;
