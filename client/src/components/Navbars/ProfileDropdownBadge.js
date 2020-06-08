import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import Badge from "reactstrap/es/Badge";
import userServices from "../../services/user.services";
import {Link} from "react-router-dom";
import LogoutButton from "./LogoutButton";
import React from "react";
import PropTypes from "prop-types";

const ProfileDropdownBadge = props => {

    const {routes} = props;

    return (
        <UncontrolledDropdown className="profile-dropdown-badge">
            <DropdownToggle nav>
                <Badge color="primary" pill className="shadow--hover">
                    <i className="ni ni-circle-08 ni-2x"/>
                    <div className="mr-2 d-inline-block ml-2 ml-md-0"
                         style={{fontSize: '1.2em', verticalAlign: "super", left: '80px'}}>
                        {userServices.currentUser.name}
                    </div>
                </Badge>
            </DropdownToggle>
            <DropdownMenu
                className='w-250px position-xs-static position-md-absolute'>
                {routes.map(route => (
                    <DropdownItem to={route.layout + route.path} tag={Link}
                                  key={'route' + route.path}>
                        <i className={route.icon}/>
                        {route.name}
                    </DropdownItem>
                ))}
                <DropdownItem className="cursor-pointer">
                    <LogoutButton history={props.history}/>
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
};

ProfileDropdownBadge.propTypes = {
    routes: PropTypes.array.isRequired
};

export default ProfileDropdownBadge;