/*eslint-disable*/
import React from "react";
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

class SimpleFooter extends React.Component {
  render() {
    return (
      <>
        <footer className=" footer">
          <Container>
            <Row className=" row-grid align-items-center mb-5">
              <Col lg="6">
                <h3 className=" text-primary font-weight-light mb-2">
                  Merci de visiter notre site !
                </h3>
                <h4 className=" mb-0 font-weight-light">
                  Vous pouvez également nous suivre sur nos autres plateformes
                </h4>
              </Col>
              <Col className=" text-lg-center btn-wrapper" lg="6">

                <Button
                  className=" btn-neutral btn-icon-only btn-round ml-1"
                  color="facebook"
                  href="https://www.facebook.com/testplaceproduits/"
                  id="tooltip383967593"
                  size="lg"
                  target="_blank"
                >
                  <i className=" fab fa-facebook-f" />
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip383967593">
                  Aimez notre page
                </UncontrolledTooltip>

              </Col>
            </Row>
            <hr />
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
                    <NavLink tag={Link} to={'/#contact-us'}>
                      Contactez-nous
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="http://www.test-place.fr/index.html"
                      target="_blank"
                    >
                      En savoir plus
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="http://www.test-place.fr//Landkit-1.1.0/src/mentionslegales.html"
                      target="_blank"
                    >
                      CGU
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default SimpleFooter;
