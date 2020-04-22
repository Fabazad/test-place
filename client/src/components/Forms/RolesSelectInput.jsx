import PropTypes from "prop-types";
import NavLink from "reactstrap/es/NavLink";
import NavItem from "reactstrap/es/NavItem";
import React, {useState} from "react";
import Nav from "reactstrap/es/Nav";
import constants from "../../helpers/constants";
import {withTranslation} from "react-i18next";

const {USER_ROLES} = constants;

const RolesSelectInput = (props) => {

    const {onChange, defaultValue, t} = props;

    const [values, setValues] = useState(defaultValue);

    const togglePill = (e, val) => {
        e.preventDefault();
        const newValues = values.includes(val) ? values.filter(v => v !== val) : values.concat([val]);
        if (newValues.length) {
            newValues.sort();
            setValues(newValues);
            onChange(newValues);
        }
    };

    const isSelected = val => values.includes(val);

    return (
        <>
            <Nav
                className="nav-fill flex-column flex-sm-row" pills role="tablist">
                <NavItem>
                    <NavLink
                        aria-selected={isSelected(USER_ROLES.TESTER)}
                        className={"border mb-sm-3 p-3 mb-md-0" + (isSelected(USER_ROLES.TESTER) ? " active" : " shadow-none")}
                        onClick={e => togglePill(e, USER_ROLES.TESTER)} href="#" role="tab"
                    >
                        <div>
                            <i className="fa fa-star fa-1x mt-1"/>
                        </div>
                        <div className="mt-2">
                            {t(USER_ROLES.TESTER)}
                        </div>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        aria-selected={isSelected(USER_ROLES.SELLER)}
                        className={"border mb-sm-3 p-3 mb-md-0" + (isSelected(USER_ROLES.SELLER) ? " active" : " shadow-none")}
                        onClick={e => togglePill(e, USER_ROLES.SELLER)} href="#" role="tab"
                    >
                        <div>
                            <i className="fa fa-dollar-sign fa-1x mt-1"/>
                        </div>
                        <div className="mt-2">
                            {t(USER_ROLES.SELLER)}
                        </div>
                    </NavLink>
                </NavItem>
            </Nav>
        </>
    );
};

RolesSelectInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.array.isRequired
};

export default withTranslation()(RolesSelectInput);