import React, {useState} from "react";
// reactstrap components
import PropTypes from "prop-types";
import {withTranslation} from "react-i18next";

const EmailLink = props => {

    const {t, email, subject, body} = props;

    return (
        <>
             <small><a href={`mailto:${email}?subject=${subject? encodeURIComponent(subject) : ''}&body=${body ? encodeURIComponent(body) : ''}`}>{email}</a></small>
        </>
    );
};

EmailLink.propTypes = {
    email: PropTypes.string.isRequired,
    subject: PropTypes.string,
    body: PropTypes.string,

};

export default withTranslation()(EmailLink);