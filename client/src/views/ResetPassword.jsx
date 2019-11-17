import React from "react";

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

// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import PasswordStrength from "components/PasswordStrength";
import { toast } from "react-toastify";
import userServices from "services/user.services";

class ResetPassword extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      password : '',
      password2 : '',
      exampleModal: false
    };
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  };
  
  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if(this.state.password !== this.state.password2) {
      toast.error("Les deux mots des passe ne sont pas identiques.");
      return;
    }
    userServices.resetPassword(this.state.password, this.props.match.params.resetPasswordToken)
      .then(() => {
        toast.success("Mot de passe modifié.");
        this.props.history.push("/login");
      })
      .catch((err) => toast.error("Le mot de passe n'a pas été modifié."));
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
                    <CardBody className="px-lg-5 py-lg-5">
                      <div className="text-center text-muted mb-4">
                        <small>Choisir un nouveau mot de passe</small>
                      </div>
                      <Form role="form" onSubmit={this.onSubmit}>
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
                              autoComplete="off"
                              name="password"
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
                              autoComplete="off"
                              name="password2"
                              value={this.state.password2} 
                              onChange={this.handleInputChange}
                              required
                            />
                          </InputGroup>
                        </FormGroup>
                        <PasswordStrength min={8} password={this.state.password} />
                        <div className="text-center">
                          <Button
                            className="my-4"
                            color="primary"
                            type="submit"
                          >
                            Valider
                          </Button>
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

export default ResetPassword;
