import {useGoogleLogin} from 'react-google-login'
import {Button} from "reactstrap";
import React from "react";
import PropTypes from "prop-types";

const GoogleLoginButton = ({onSuccess, onFailure}) => {
    const {signIn} = useGoogleLogin({
        onSuccess,
        onFailure,
        clientId: "165720093757-rekthd2sfe0nn7m0tb7f0bopuquqdfn7.apps.googleusercontent.com",
    })

    return <Button
        className="btn-neutral btn-icon ml-1"
        color="default"
        onClick={() => signIn()}
    >
        <span className="btn-inner--icon mr-1">
            <img alt="..." src={require("assets/img/icons/common/google.svg")}/>
        </span>
        <span className="btn-inner--text">Google</span>
    </Button>
}

GoogleLoginButton.propTypes = {
    onSuccess: PropTypes.func.isRequired,
    onFailure: PropTypes.func.isRequired
};

export default GoogleLoginButton