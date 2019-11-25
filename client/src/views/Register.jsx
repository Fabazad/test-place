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
  Col
} from "reactstrap";

import { Link } from 'react-router-dom';

// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import PasswordStrength from "components/PasswordStrength";
import Loading from "components/Loading";
import SwitchButtons from "components/SwitchButtons";
import PrivacyPolicyModal from "components/Modals/PrivacyPolicyModal";

class Register extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email : '',
      password: '',
      password2: '',
      role: '',
      captcha: '',
      loadingPromise: null
    };
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }
  
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

    const loadingPromise = userService.register(this.state.email, this.state.password, this.state.role, this.state.captcha).then(res => {
      this.props.history.push('/login');
      toast.success("Un mail de validation vous a été envoyé.");
    });
    this.setState({ loadingPromise });
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }

  onCaptchaChange(value) {
    this.setState({ captcha: value});
  }

  render() {
    return (
      <>
        <main ref="main">
          <section className="section section-shaped section-lg">
            <div className="shape shape-style-1 bg-gradient-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <Container className="pt-lg-md">
              <Row className="justify-content-center">
                <Col lg="5">
                  <Card className="bg-secondary shadow border-0">
                    <Loading promise={this.state.loadingPromise} />
                    <CardHeader className="bg-white pb-5">
                      <div className="text-muted text-center mb-3">
                        <small>Sign up with</small>
                      </div>
                      <div className="text-center">
                        <Button
                          className="btn-neutral btn-icon mr-4"
                          color="default"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <span className="btn-inner--icon mr-1">
                            <img
                              alt="..."
                              src={require("assets/img/icons/common/github.svg")}
                            />
                          </span>
                          <span className="btn-inner--text">Github</span>
                        </Button>
                        <Button
                          className="btn-neutral btn-icon ml-1"
                          color="default"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <span className="btn-inner--icon mr-1">
                            <img
                              alt="..."
                              src={require("assets/img/icons/common/google.svg")}
                            />
                          </span>
                          <span className="btn-inner--text">Google</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                      <div className="text-center text-muted mb-4">
                        <small>Or sign up with credentials</small>
                      </div>
                      <Form role="form" onSubmit={this.onSubmit}>
                        <div className="mt-3 mb-4">
                          <SwitchButtons 
                            fields={[{label: "Testeur", value: 'reviewer'}, {label: "Vendeur", value: 'seller'}]} 
                            onChange={this.handleInputChange}
                            name="role"
                          />
                        </div>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-email-83" />
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
                                <i className="ni ni-lock-circle-open" />
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
                                <i className="ni ni-lock-circle-open" />
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
                        <PasswordStrength min={8} password={this.state.password} />
                        <div className="text-center mb-3 mt-4">
                          <ReCAPTCHA
                            sitekey="6LfcE8IUAAAAAIMSa9vEYhqVngqTXbtegnYhGkkH"
                            onChange={($event) => this.onCaptchaChange($event)}
                          />
                        </div>
                        <Row className="my-4">
                          <Col xs="12">
                            <div className="custom-control custom-control-alternative custom-checkbox">
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
                                  <PrivacyPolicyModal />
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
        <SimpleFooter />
      </>
    );
  }
}

export default Register;
