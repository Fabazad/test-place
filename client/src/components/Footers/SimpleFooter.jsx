/*eslint-disable*/
import React, {useState} from "react";
// reactstrap components
import {
    Button,
    NavItem,
    NavLink,
    Nav,
    Container,
    Row,
    Col,
    UncontrolledTooltip
} from "reactstrap";
import {Link} from "react-router-dom";
import ShareModal from "../Modals/ShareModal";

const SimpleFooter = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);

    return (
        <>
            <footer className=" footer">
                <Container>
                    <Row className=" row-grid align-items-center mb-5">
                        <Col lg="6">
                            <h3 className=" text-primary font-weight-light mb-2">
                                Merci de visiter notre site !
                            </h3>
                        </Col>
                    </Row>
                    <hr/>
                    <Row className=" align-items-center justify-content-md-between">
                        <Col md="6">
                            <div className=" copyright">
                                © {new Date().getFullYear()}{" "}
                                <a
                                    href="http://www.test-place.fr/index.html"
                                    target="_blank"
                                >
                                    Test Place
                                </a>
                                .
                            </div>
                        </Col>
                        <Col md="6">
                            <Nav className=" nav-footer justify-content-end">
                                <NavItem>
                                    <NavLink onClick={toggleModal} className="cursor-pointer">
                                        Partager
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to={'/#contact-us'}>
                                        Contactez-nous
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/register#privacyPolicy">
                                        CGU
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                    </Row>
                </Container>
            </footer>
            <ShareModal onToggle={toggleModal} isOpen={isOpen}/>
        </>
    );
};

export default SimpleFooter;
