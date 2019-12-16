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
import constants from "../helpers/constants";

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            role: '',
            captcha: '',
            loadingPromise: null,
            amazonId: '',
            amazonLoading: false
        };
        this.onAmazonLogin = this.onAmazonLogin.bind(this);
        this.onAmazonFailure = this.onAmazonFailure.bind(this);
        this.stopAmazonLoading = this.stopAmazonLoading.bind(this);
        this.onAmazonLogout = this.onAmazonLogout.bind(this);
        this.stopAmazonLoading = this.stopAmazonLoading.bind(this);
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
        if (!this.state.amazonId) {
            toast.error("Vous devez lier un compte Amazon.");
            return;
        }

        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            role: this.state.role,
            captcha: this.state.captcha,
            amazonId: this.state.amazonId
        };

        const loadingPromise = userService.register(user).then(res => {
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

    onAmazonLogin(response) {
        this.setState({
            name: response._profile.name,
            amazonId: response._profile.id,
            email: this.state.email ? this.state.email : response._profile.email,
            amazonLoading: false
        });
    }
    onAmazonLogout() {
        this.setState({
            amazonId: '',
            amazonLoading: false
        });
    }

    onAmazonFailure(err) {
        toast.error(err);
        this.setState({
            amazonLoading: false
        });
    }

    stopAmazonLoading() {
        this.setState({amazonLoading: false});
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
                                        <Loading promise={this.state.loadingPromise} loading={this.state.amazonLoading}/>
                                        <CardHeader className="bg-white pb-5">
                                            <div className="text-muted text-center mb-3">
                                                <small>Sign up with</small>
                                            </div>
                                            <div className="text-center">

                                            </div>
                                        </CardHeader>
                                        <CardBody className="px-lg-5 py-lg-5">
                                            <div className="text-center text-muted mb-4" >
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
                                                <FormGroup className="text-center">
                                                    <AmazonLoginButton
                                                        className={"w-100"}
                                                        linked={!!this.state.amazonId}
                                                        provider='amazon'
                                                        appId={constants.AMAZON_APP_ID}
                                                        onLoginSuccess={res => this.onAmazonLogin(res)}
                                                        onLoginFailure={this.onAmazonFailure}
                                                        onStartLogin={() => this.setState({amazonLoading: true})}
                                                        onStartLogout={() => this.setState({amazonLoading: true})}
                                                        onLogoutSuccess={this.onAmazonLogout}
                                                        onLogoutFailure={this.onAmazonFailure}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative mb-3">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="ni ni-single-02"/>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input
                                                            placeholder="Nom d'utilisateur"
                                                            type="name"
                                                            name="name"
                                                            value={this.state.name}
                                                            onChange={this.handleInputChange}
                                                            required
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
