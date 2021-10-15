import React from "react";
import {withTranslation} from "react-i18next";

const ReviewAdvices = ({t}) => {
    return (
        <ul>
            <li>{t("REVIEW_ADVICE_1")}</li>
            <li>{t("REVIEW_ADVICE_2")}</li>
            <li>{t("REVIEW_ADVICE_3")}</li>
        </ul>
    )
};

export default withTranslation()(ReviewAdvices);