import {
    Button,
    Card,
    CardBody,
    Col,
    Container,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row
} from "reactstrap";
import React, {useState} from "react";
import classnames from "classnames";
import Form from "reactstrap/es/Form";

const ContactSections = () => {

    const [nameFocused, setNameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);

    return (
        <>
            <section className="section section-lg bg-gradient-default">
                <Container className="pt-lg" style={{paddingBottom: "150px"}}>
                    <Row className="text-center justify-content-center">
                        <Col lg="10">
                            <h2 className="display-3 text-white">Vous avez des questions ou des remarques ?</h2>
                            <p className="lead text-white">
                                N'hésitez pas à nous contacter que ce soit pour des questions, des remarques ou bien des
                                idées.<br/>
                                Ce sera avec grand plaisir que nous vous répondrons.
                            </p>
                        </Col>
                    </Row>
                </Container>
                {/* SVG separator */}
                <div className="separator separator-bottom separator-skew zindex-100 w-100">
                    <svg className="w-100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
                         version="1.1" viewBox="0 0 2560 100" x="0" y="0">
                        <polygon className="fill-white" points="2560 0 2560 100 0 100"/>
                    </svg>
                </div>
            </section>
            <section className="section section-lg pt-lg-0 section-contact-us">
                <Container>
                    <Row className="justify-content-center" style={{marginTop: "-200px"}}>
                        <Col lg="8">
                            <Card className="bg-gradient-secondary shadow">
                                <CardBody className="p-lg-5">
                                    <Form>
                                        <FormGroup className={classnames({focused: nameFocused})}>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-user-run"/>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input placeholder="Votre nom" type="text"
                                                       onFocus={() => setNameFocused(true)}
                                                       onBlur={() => setNameFocused(false)}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup className={classnames({focused: emailFocused})}>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-email-83"/>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input placeholder="Votre adresse mail" type="email"
                                                       onFocus={() => setEmailFocused(true)}
                                                       onBlur={() => setEmailFocused(false)}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup className="mb-4">
                                            <Input className="form-control-alternative" cols="80" name="name"
                                                   placeholder="Dites-nous tout..." rows="4" type="textarea"/>
                                        </FormGroup>
                                        <div>
                                            <Button block className="btn-round" color="default" size="lg" type="submit">
                                                Envoyer votre message
                                            </Button>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
};

export default ContactSections;