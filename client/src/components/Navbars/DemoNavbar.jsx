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

class DemoNavbar extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            routes: []
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

    render() {
        const isAuth = userServices.isAuth();
        return (
            <>
                <header className="header-global ">
                    <Navbar
                        className="navbar-main navbar-transparent navbar-light headroom position-fixed"
                        expand="lg"
                        id="navbar-main"
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
                            <button className="navbar-toggler" id="navbar_global">
                                <span className="navbar-toggler-icon"/>
                            </button>
                            <UncontrolledCollapse navbar toggler="#navbar_global">
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
                                <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                                    <NavItem>
                                        <NavLink to='/search' tag={Link}
                                                 className="nav-link-inner--text text-white cursor-pointer">
                                            Recherche
                                        </NavLink>
                                    </NavItem>

                                    {isAuth ? (
                                        <UncontrolledDropdown>
                                            <DropdownToggle nav>
                                                <span className='d-inline d-lg-none text-black'>Dashboard</span>
                                                <span className="d-none d-lg-inline text-white">Dashboard</span>
                                            </DropdownToggle>
                                            <DropdownMenu className='w-200px'>
                                                {
                                                    this.state.routes.map(route => (
                                                        <DropdownItem to={route.layout + route.path} tag={Link} key={'route'+route.path}>
                                                            <i className={route.icon}/>
                                                            {route.name}
                                                        </DropdownItem>
                                                    ))
                                                }
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    ) : null}
                                </Nav>
                                <Nav className="align-items-lg-center ml-lg-auto" navbar>
                                    {!isAuth ? (
                                        <NavItem>
                                            <Button to='/login' tag={Link} color={'secondary'}
                                                    className="nav-link-inner--text">
                                                Connexion
                                            </Button>
                                        </NavItem>) : null
                                    }
                                    {!isAuth ? (
                                        <NavItem>
                                            <NavLink to='/register' tag={Link}
                                                     className="nav-link-inner--text text-white cursor-pointer">Inscription</NavLink>
                                        </NavItem>) : null
                                    }
                                    {isAuth ? (
                                        <NavItem>
                                            <LogoutButton history={this.props.history}/>
                                        </NavItem>
                                    ) : null}
                                </Nav>
                            </UncontrolledCollapse>
                        </Container>
                    </Navbar>
                </header>
            </>
        );
    }
}

export default DemoNavbar;
