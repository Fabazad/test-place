import {NavLink} from "reactstrap";
import React from "react";
import {withTranslation} from "react-i18next";

const ContactItem = ({t}) => {
    return <>
        <NavLink className="cursor-pointer" onClick={() => window.$crisp.push(["do", "chat:open"])}>
            <i className="ni ni-email-83"/>
            {t("CONTACT_US")}
        </NavLink>
    </>
}

export default withTranslation()(ContactItem)