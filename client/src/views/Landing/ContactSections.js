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
import MessageSentMessage from "./MessageSentModal";
import userServices from "../../services/user.services";
import {toast} from "react-toastify";
import Loading from "../../components/Loading";
import {withTranslation} from "react-i18next";
import ConfirmButton from "../../components/Buttons/ConfirmButton";

const ContactSections = (props) => {

    const {t} = props;

    const [nameFocused, setNameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onToggle = () => setIsOpen(!isOpen);

    const onSubmit = e => {
        e.preventDefault();

        if (!name || !email || !message) {
            toast.error(t("MISSING_FIELDS"));
        }

        setLoading(true);
        userServices.sendContactUsMessage(name, email, message).then(() => {
            onToggle();
            setName("");
            setEmail("");
            setMessage("");
            setLoading(false);
        });
    };

    return (
        <>
            <section className="section section-lg bg-gradient-default">
                <Container className="pt-5 pb-md-8" id="contact-us">
                    <Row className="text-center justify-content-center">
                        <Col lg="10">
                            <h2 className="display-3 text-white">{t("QUESTIONS_OR_REMARKS")}</h2>
                            <p className="lead text-white white-space-pre-line">
                                {t("DONT_HESITATE_TO_CONTACT")}
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
                                    <Form onSubmit={onSubmit}>
                                        <Loading loading={loading}/>
                                        <FormGroup className={classnames({focused: nameFocused})}>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-user-run"/>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input placeholder={t("YOUR_NAME")} type="text" value={name} required
                                                       onFocus={() => setNameFocused(true)} name="name"
                                                       onBlur={() => setNameFocused(false)}
                                                       onChange={e => setName(e.target.value)}
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
                                                <Input placeholder={t("YOUR_MAIL_ADDRESS")} type="email" value={email}
                                                       onFocus={() => setEmailFocused(true)} required
                                                       onBlur={() => setEmailFocused(false)}
                                                       onChange={e => setEmail(e.target.value)} name="email"
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup className="mb-4">
                                            <Input className="form-control-alternative" cols="80" value={message}
                                                   onChange={e => setMessage(e.target.value)} required name="message"
                                                   placeholder={t("TELL_US_EVERYTHING")} rows="4" type="textarea"/>
                                        </FormGroup>
                                        <div className="text-center">
                                            <ConfirmButton color="default" type="submit"
                                                           disabled={!name || !email || !message}>
                                                {t("SEND_YOUR_MESSAGE")}
                                            </ConfirmButton>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
            <MessageSentMessage isOpen={isOpen} onToggle={onToggle}/>
        </>
    )
};

export default withTranslation()(ContactSections);