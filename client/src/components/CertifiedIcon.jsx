import React, {useState} from "react";
import '../assets/scss/animated-checks.scss';
import PropTypes from "prop-types";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";
import IdHelper from "../helpers/IdHelper";
import {withTranslation} from "react-i18next";


const CertifiedIcon = ({ className, t }) => {

    const [target, _] = useState(IdHelper.newId('certified').toString());

    return (
        <span className={className || ""}>
            <UncontrolledTooltip target={target} delay={0}>
                {t("CERTIFIED_USER")}
            </UncontrolledTooltip>
            <i id={target} className="fa fa-check-circle text-green"/>
        </span>
    );
};

CertifiedIcon.propTypes = {
    className: PropTypes.string
};

export default withTranslation()(CertifiedIcon);
