import AnimatedError from "../../AnimatedError";
import LoginForm from "../../Forms/LoginForm";
import {Link} from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";

const LoginBody = props => {

    const onLogin = () => {
        if (props.onLogin) props.onLogin();
    };

    return (
        <>
            <AnimatedError/>
            <p className="mb-3">Vous devez être connecté pour demander à tester un produit.</p>
            <div className="bg-secondary rounded p-3 shadow">
                <LoginForm onLogin={onLogin}/>
            </div>
            <div className="my-3">Ou</div>
            <Link to={'/register'}>Créer un compte</Link>
        </>
    );
};

LoginBody.propTypes = {
    onLogin: PropTypes.func
};

export default LoginBody;