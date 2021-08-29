import {NavLink} from "reactstrap";
import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import ContactModal from "../Modals/ContactModal";

import userServices from "../../services/user.services";

const ContactItem = () => {
    const history = useHistory();
    const {location} = history;
    const [isOpen, setIsOpen] = useState(false);

    const user = userServices.currentUser

    useEffect(() => {
        if (location?.hash === "#contact-us") setIsOpen(true);
        else setIsOpen(false)
    }, [location?.hash]);

    const handleToggle = () => {
        history.push(location.pathname);
    }

    return <>
        <NavLink to="#contact-us" tag={Link}>
            <i className="ni ni-email-83"/>
            Nous contacter
        </NavLink>
        <ContactModal isOpen={isOpen} onToggle={handleToggle} user={user}/>
    </>
}

export default ContactItem