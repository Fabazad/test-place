import TesterInfoForm from "../../Forms/TesterInfoForm";
import React from "react";
import PropTypes from "prop-types";
import {withTranslation} from "react-i18next";

const BecomeTesterBody = props => {

    const { t } = props;

    const onSaved = () => {
        if (props.onSaved) props.onSaved();
    };

    return (
        <>
            <p className="mb-3">
                {t("FIll_THIS_INFO_FIRST")}
            </p>
            <div className="bg-secondary rounded p-3 shadow">
                <TesterInfoForm onSaved={onSaved} btnText="Enregistrer" addRole={true}/>
            </div>
        </>
    )
};

BecomeTesterBody.propTypes = {
    onSaved: PropTypes.func
};

export default withTranslation()(BecomeTesterBody);