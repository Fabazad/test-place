import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
// JavaScript plugin that hides or shows a component based on your scroll
import Headroom from "headroom.js";
// reactstrap components
import {
    Button,
    NavbarBrand,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
    Row,
    Col
} from "reactstrap";
import routesJson from "../../routes";
import userServices from "../../services/user.services";
import Collapse from "reactstrap/es/Collapse";
import Notifications from "../Notifications/Notifications";
import ProfileDropdownBadge from "./ProfileDropdownBadge";
import NavItems from "./NavItems";
import {withTranslation} from "react-i18next";
import LanguageSelector from "../LanguageSelector";

const DemoNavbar = props => {

    const {t} = props;

    const translatedRoutes = routesJson(t);
    const [isOpen, setIsOpen] = useState(false);
    const [routes, setRoutes] = useState(translatedRoutes.filter(route => !route.role || userServices.hasRole(route.role)));

    useEffect(() => {
        let headroom = new Headroom(document.getElementById("navbar-main"));
        headroom.init();
        const subscriber = userServices.currentUserSubject.subscribe(() => {
            setRoutes(routesJson(t).filter(route => !route.role || userServices.hasRole(route.role)));
        });

        return () => subscriber.unsubscribe();

    }, []);

    const toggle = (open = !isOpen) => setIsOpen(open);

    useEffect(() => toggle(false), [props.location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps
    const isAuth = userServices.isAuth();
    return (
        <>
            <header className="header-global ">
                <Navbar
                    className="navbar-main navbar-transparent navbar-light headroom position-fixed pt-2 pb-1"
                    expand="lg" id="navbar-main"
                    style={{"zIndex": "10"}}
                >
                    <Container className='mx-2 mw-100'>
                        <NavbarBrand className="mr-lg-5 d-flex" to="/" tag={Link}>
                            <img
                                style={{height: "50px"}}
                                alt="..."
                                src={require("assets/img/brand/logo_test_place.png")}
                            />
                            <span className="h3 text-light ml-3 my-auto"
                                  style={{lineHeight: "60px"}}>testplace.io</span>
                        </NavbarBrand>
                        {isAuth && (<div className="d-md-none">
                            <Notifications/>
                        </div>)}
                        <button className="navbar-toggler" id="navbar_global" onClick={() => toggle()}>
                            <span className="navbar-toggler-icon"/>
                        </button>
                        <div className="ml-1 w-100">
                            <Collapse navbar isOpen={isOpen}>
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
                                            <button className="navbar-toggler" id="navbar_global"
                                                    onClick={() => toggle(false)}>
                                                <span/>
                                                <span/>
                                            </button>
                                        </Col>
                                    </Row>
                                </div>
                                <Nav className="align-items-lg-center ml-lg-auto" navbar>
                                    {!isAuth && (
                                        <>
                                            <NavItem>
                                                <Button to='/register' tag={Link} color='secondary'
                                                        className="nav-link-inner--text d-none d-md-block"
                                                        data-testid="signup-button">
                                                    {t("SIGN_UP")}
                                                </Button>
                                                <NavLink to='/register' tag={Link}
                                                         className="nav-link-inner--text text-white cursor-pointer d-md-none mt-3">
                                                    <i className="fa fa-sign-in-alt text-primary mr-3"/>
                                                    {t("SIGN_UP")}
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink to='/login' tag={Link} data-testid="signin-button"
                                                         className="nav-link-inner--text text-white cursor-pointer">
                                                    <i className="fa fa-user text-success mr-3 d-md-none"/>
                                                    {t("SIGN_IN")}
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink to='/#how-it-works' tag={Link} data-testid="how-it-works"
                                                         className="nav-link-inner--text text-white cursor-pointer">
                                                    <i className="fa fa-question text-danger mr-3 d-md-none"/>
                                                    {t("HOW_DOES_IT_WORK")}
                                                </NavLink>
                                            </NavItem>
                                        </>)
                                    }
                                    {isAuth && (
                                        <NavItem className="d-none d-md-block">
                                            <Notifications/>
                                        </NavItem>
                                    )}
                                    {isAuth && (
                                        <>
                                            <NavItem className="d-none d-md-block">
                                                <ProfileDropdownBadge routes={routes} history={props.history}/>
                                            </NavItem>
                                            <NavItems routes={routes}/>
                                        </>
                                    )}
                                    <NavItem >
                                        <LanguageSelector/>
                                    </NavItem>
                                </Nav>
                            </Collapse>
                        </div>
                    </Container>
                </Navbar>
            </header>
        </>
    );
};

export default withTranslation()(DemoNavbar);
