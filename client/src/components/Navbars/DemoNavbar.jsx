import React from "react";
import {Link} from "react-router-dom";
// JavaScript plugin that hides or shows a component based on your scroll
import Headroom from "headroom.js";
// reactstrap components
import {
    UncontrolledCollapse,
    DropdownMenu,
    Button,
    DropdownToggle,
    UncontrolledDropdown,
    DropdownItem,
    NavbarBrand,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
    Row,
    Col
} from "reactstrap";
import LogoutButton from "./LogoutButton";
import routes from "../../routes";
import userServices from "../../services/user.services";
import Badge from "reactstrap/es/Badge";
import Input from "reactstrap/es/Input";
import InputGroup from "reactstrap/es/InputGroup";
import InputGroupAddon from "reactstrap/es/InputGroupAddon";
import InputGroupText from "reactstrap/es/InputGroupText";
import SearchProductNavForm from "../Forms/SearchProductNavForm";
import Collapse from "reactstrap/es/Collapse";

class DemoNavbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            routes: [],
            isOpen: false
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        let headroom = new Headroom(document.getElementById("navbar-main"));
        // initialise
        headroom.init();
        this._isMounted && this.setState({
            routes: routes.filter(route => !route.role || userServices.hasRole(route.role))
        });
        userServices.currentUserSubject.subscribe(() => {
            this._isMounted && this.setState({
                routes: routes.filter(route => !route.role || userServices.hasRole(route.role))
            });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    toggle() {
        this.setState({isOpen: !this.state.isOpen});
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.pathname !== this.props.location.pathname && this.state.isOpen) {
            this.toggle();
        }
    }

    render() {
        const isAuth = userServices.isAuth();
        return (
            <>
                <header className="header-global ">
                    <Navbar
                        className="navbar-main navbar-transparent navbar-light headroom position-fixed pt-2 pb-1"
                        expand="lg" id="navbar-main"
                        style={{"zIndex": "10"}}
                    >
                        <Container className='ml-2 mw-100 mr-5'>
                            <NavbarBrand className="mr-lg-5 d-flex" to="/" tag={Link}>
                                <img
                                    style={{height: "50px"}}
                                    alt="..."
                                    src={require("assets/img/brand/logo_test_place.png")}
                                />
                                <span className="h3 text-light ml-3 my-auto"
                                      style={{lineHeight: "60px"}}>Test Place</span>
                            </NavbarBrand>
                            <button className="navbar-toggler" id="navbar_global" onClick={() => this.toggle()}>
                                <span className="navbar-toggler-icon"/>
                            </button>
                            <div className="ml-1 w-100">
                                <Collapse navbar isOpen={this.state.isOpen}>
                                    <div className="navbar-collapse-header">
                                        <Row>
                                            <Col className="collapse-brand" xs="6">
                                                <Link to="/">
                                                    <img
                                                        alt="..."
                                                        src={require("assets/img/brand/logo_test_place.png")}
                                                    />
                                                </Link>
                                            </Col>
                                            <Col className="collapse-close" xs="6">
                                                <button className="navbar-toggler" id="navbar_global">
                                                    <span/>
                                                    <span/>
                                                </button>
                                            </Col>
                                        </Row>
                                    </div>
                                    <Nav className="navbar-nav-hover align-items-lg-center w-100" navbar>
                                        <NavItem className='w-100'>
                                            <SearchProductNavForm history={this.props.history}/>
                                        </NavItem>
                                    </Nav>
                                    <Nav className="align-items-lg-center ml-lg-auto" navbar>
                                        {!isAuth ? (
                                            <>
                                                <NavItem>
                                                    <Button to='/login' tag={Link} color={'secondary'}
                                                            className="nav-link-inner--text d-none d-md-block"
                                                            data-testid="login-button">
                                                        Connexion
                                                    </Button>
                                                    <NavLink to='/login' tag={Link}
                                                             className="nav-link-inner--text text-white cursor-pointer d-md-none mt-3">
                                                        <i className="fa fa-user text-success mr-3"/>
                                                        Connexion
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink to='/register' tag={Link} data-testid="signin-button"
                                                             className="nav-link-inner--text text-white cursor-pointer">
                                                        <i className="fa fa-sign-in-alt text-primary mr-3 d-md-none"/>
                                                        Inscription
                                                    </NavLink>
                                                </NavItem>
                                            </>) : null
                                        }
                                        {isAuth ? (
                                            <NavItem>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle nav>
                                                        <Badge color="primary" pill className="shadow--hover">
                                                            <i className="ni ni-circle-08 ni-2x"/>
                                                            <div className="mr-2 d-inline-block ml-2 ml-md-0"
                                                                 style={{fontSize: '1.2em', verticalAlign: "super"}}>
                                                                {userServices.currentUser.name}
                                                            </div>
                                                        </Badge>
                                                    </DropdownToggle>
                                                    <DropdownMenu className='w-200px'>
                                                        {this.state.routes.map(route => (
                                                            <DropdownItem to={route.layout + route.path} tag={Link}
                                                                          key={'route' + route.path}>
                                                                <i className={route.icon}/>
                                                                {route.name}
                                                            </DropdownItem>
                                                        ))}
                                                        <DropdownItem className="cursor-pointer">
                                                            <LogoutButton history={this.props.history}/>
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </NavItem>
                                        ) : null}
                                    </Nav>
                                </Collapse>
                            </div>
                        </Container>
                    </Navbar>
                </header>
            </>
        );
    }
}

export default DemoNavbar;
