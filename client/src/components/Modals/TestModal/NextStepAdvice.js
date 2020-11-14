import PropTypes from "prop-types";
import Label from "reactstrap/lib/Label";
import Alert from "reactstrap/es/Alert";
import React from "react";
import {withTranslation} from "react-i18next";

const NextStepAdvice = props => {

    const {color, children, t} = props;

    return (
        <div className="text-left w-100">
            <Label>{t("NEXT")}</Label>
            <Alert color={color ? color : 'info'} className="white-space-pre-line">
                {children}
            </Alert>
        </div>
    );
};

NextStepAdvice.propTypes = {
    color: PropTypes.string.isRequired
};

export default withTranslation()(NextStepAdvice);