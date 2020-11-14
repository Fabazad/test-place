import LoginForm from "../../Forms/LoginForm";
import {Link} from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";
import {withTranslation} from "react-i18next";

const LoginBody = props => {

    const { t } = props;

    const onLogin = () => {
        if (props.onLogin) props.onLogin();
    };

    return (
        <>
            <p className="mb-3">{t("LOGIN_BEFORE_TESTING")}</p>
            <div className="bg-secondary rounded p-3 shadow">
                <LoginForm onLogin={onLogin}/>
            </div>
            <div className="my-3">Ou</div>
            <Link to={'/register'}>{t("CREATE_AN_ACCOUNT")}</Link>
        </>
    );
};

LoginBody.propTypes = {
    onLogin: PropTypes.func
};

export default withTranslation()(LoginBody);