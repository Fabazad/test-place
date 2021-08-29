import {
    Card,
    CardBody,
    Col,
    Container,
    Row
} from "reactstrap";
import React, {useState} from "react";
import MessageSentMessage from "./MessageSentModal";
import userServices from "../../services/user.services";
import {withTranslation} from "react-i18next";
import ContactForm from "../../components/Forms/ContactForm";

const ContactSections = (props) => {

    const {t} = props;

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onToggle = () => setIsOpen(!isOpen);

    const onSubmit = ({ name, email, message }) => {
        setLoading(true);
        userServices.sendContactUsMessage(name, email, message).finally(() => {
            onToggle();
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
                                    <ContactForm onSubmit={onSubmit} loading={loading}/>
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