/*eslint-disable*/
import React, {useEffect, useState} from "react";
import {NavLink as NavLinkRRD, Link} from "react-router-dom";
// nodejs library to set properties for components
import {PropTypes} from "prop-types";
import testServices from '../../services/test.services';

// reactstrap components
import {
    Collapse,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Media,
    NavbarBrand,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
    Row,
    Col
} from "reactstrap";
import ShareModal from "../Modals/ShareModal";
import Badge from "reactstrap/es/Badge";

const Sidebar = props => {

    const [collapseOpen, setCollapseOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [testGlobalStatusesCount, setTestGlobalStatusesCount] = useState(null);

    useEffect(() => {
        setTestGlobalStatusesCount(testServices.testGlobalStatusesCount);
        const subscriber = testServices.testCountSubject.subscribe(res => {
            setTestGlobalStatusesCount(res);
        });

        return () => subscriber.unsubscribe();
    }, []);

    // toggles collapse between opened and closed (true/false)
    const toggleCollapse = () => {
        setCollapseOpen(!collapseOpen);
    };
    // closes the collapse
    const closeCollapse = () => {
        setCollapseOpen(false);
    };
    // creates the links that appear in the left menu / Sidebar
    const createLinks = routes => {
        return routes.map((prop, key) => (
            <NavItem key={key}>
                <NavLink
                    to={prop.layout + prop.path}
                    tag={NavLinkRRD}
                    onClick={closeCollapse}
                    activeClassName="active"
                    className="position-relative"
                >
                    <i className={prop.icon + " text-" + prop.color}/>
                    {prop.name}
                    {testGlobalStatusesCount && prop.testCount ? (
                        <Badge color={prop.color} className="position-absolute" style={{right: '5px'}}>
                            {testGlobalStatusesCount[prop.testCount]}
                        </Badge>
                    ) : null}
                </NavLink>
            </NavItem>
        ));
    };

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const {bgColor, routes, logo} = props;
    let navbarBrandProps;
    if (logo && logo.innerLink) {
        navbarBrandProps = {
            to: logo.innerLink,
            tag: Link
        };
    } else if (logo && logo.outterLink) {
        navbarBrandProps = {
            href: logo.outterLink,
            target: "_blank"
        };
    }

    return (
        <Navbar
            className="navbar-vertical fixed-left navbar-light bg-white pt-5 d-none d-lg-block"
            expand="md"
            id="sidenav-main"
        >
            <Container fluid>
                {/* Toggler */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleCollapse}
                >
                    <span className="navbar-toggler-icon"/>
                </button>
                {/* Brand */}
                {logo && (
                    <NavbarBrand className="pt-0" {...navbarBrandProps}>
                        <img
                            alt={logo.imgAlt}
                            className="navbar-brand-img"
                            src={logo.imgSrc}
                            style={{height: "90px"}}
                        />
                        <span className='ml-2' style={{"verticalAlign": 'sub'}}>Test Place</span>
                    </NavbarBrand>
                )}
                {/* Collapse */}
                <Collapse navbar isOpen={collapseOpen}>
                    {/* Collapse header */}
                    <div className="navbar-collapse-header d-md-none">
                        <Row>
                            {logo && (
                                <Col className="collapse-brand" xs="6">
                                    {logo.innerLink ? (
                                        <Link to={logo.innerLink}>
                                            <img alt={logo.imgAlt} src={logo.imgSrc}/>
                                        </Link>
                                    ) : (
                                        <a href={logo.outterLink}>
                                            <img alt={logo.imgAlt} src={logo.imgSrc}/>
                                        </a>
                                    )}
                                </Col>
                            )}
                            <Col className="collapse-close" xs="6">
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    onClick={toggleCollapse}
                                >
                                    <span/>
                                    <span/>
                                </button>
                            </Col>
                        </Row>
                    </div>
                    {/* Form */}
                    <Form className="mt-4 mb-3 d-md-none">
                        <InputGroup className="input-group-rounded input-group-merge">
                            <Input
                                aria-label="Search"
                                className="form-control-rounded form-control-prepended"
                                placeholder="Search"
                                type="search"
                            />
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <span className="fa fa-search"/>
                                </InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </Form>
                    {/* Navigation */}
                    <Nav navbar className="mt-4">{createLinks(routes)}</Nav>
                    {/* Divider */}
                    <hr className="my-3"/>
                    {/* Navigation */}
                    <Nav className="mb-md-3" navbar>
                        <NavItem>
                            <NavLink onClick={toggleModal} className="cursor-pointer">
                                <i className="ni ni-curved-next"/>
                                Partager
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/#contact-us" tag={Link}>
                                <i className="ni ni-email-83"/>
                                Nous contacter
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Container>
            <ShareModal onToggle={toggleModal} isOpen={isOpen}/>
        </Navbar>
    );
};

Sidebar.defaultProps = {
    routes: [{}]
};

Sidebar.propTypes = {
    // links that will be displayed inside the component
    routes: PropTypes.arrayOf(PropTypes.object),
    logo: PropTypes.shape({
        // innerLink is for links that will direct the user within the app
        // it will be rendered as <Link to="...">...</Link> tag
        innerLink: PropTypes.string,
        // outterLink is for links that will direct the user outside the app
        // it will be rendered as simple <a href="...">...</a> tag
        outterLink: PropTypes.string,
        // the image src of the logo
        imgSrc: PropTypes.string.isRequired,
        // the alt for the img
        imgAlt: PropTypes.string.isRequired
    })
};

export default Sidebar;
