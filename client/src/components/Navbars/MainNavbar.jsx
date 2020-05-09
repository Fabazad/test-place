import React from "react";
import { Link } from "react-router-dom";
import Headroom from "headroom.js";
import { initHistorySteps } from "actions/historySteps";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";

class MainNavbar extends React.Component {
  componentDidMount() {
    let headroom = new Headroom(document.getElementById("navbar-main"));
    // initialise
    headroom.init();
  }
  render() {
    return (
      <>
        <header className="header-global">
          <Navbar
            className="navbar-horizontal navbar-dark bg-primary navbar-transparent p-2"
            id="navbar-main"
          >
            <Container>
              <NavbarBrand className="mr-lg-5" to="/" tag={Link}>
                <img
                  alt="..."
                  src={require("assets/img/brand/pimp-logo.png")}
                />
              </NavbarBrand>
              <button className="navbar-toggler" id="navbar_global">
                <span className="navbar-toggler-icon" />
              </button>
              <UncontrolledCollapse navbar toggler="#navbar_global">
                <div className="navbar-collapse-header ml-1">
                  <Row>
                    <Col className="collapse-brand" xs="6">
                      <Link to="/">
                        <img
                          alt="..."
                          src={require("assets/img/brand/pimp-logo.png")}
                        />
                      </Link>
                    </Col>
                    <Col className="collapse-close" xs="6">
                      <button className="navbar-toggler" id="navbar_global">
                        <span />
                        <span />
                      </button>
                    </Col>
                  </Row>
                </div>
                <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                  <NavItem>
                    <NavLink to={"/"} tag={Link} onClick={() => this.props.initHistorySteps([])}>
                      Steps
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to={"/edit-step/"} tag={Link} onClick={() => this.props.initHistorySteps([])}>
                      Admin
                    </NavLink>
                  </NavItem>
                </Nav>
              </UncontrolledCollapse>
            </Container>
          </Navbar>
        </header>
      </>
    );
  }
}

MainNavbar.propTypes = {
  initHistorySteps: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  initHistorySteps: step => dispatch(initHistorySteps(step))
});

export default connect(
  null,
  mapDispatchToProps
)(MainNavbar);
