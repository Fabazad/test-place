import AnimatedCheck from "../../AnimatedCheck";
import {Link} from "react-router-dom";
import React from "react";
import {withTranslation} from "react-i18next";

const SentRequest = props => {

    const {t} = props;

    return (
        <>
            <AnimatedCheck/>
            <p className="mt-5 h4 white-space-pre-line">
                {t("TEST_REQUEST_HAS_BEEN_SENT")}<br/>
                <Link to="/dashboard/sent-requests">{t("MY_SENT_REQUESTS")}</Link>
            </p>
        </>
    )
};

export default withTranslation()(SentRequest);