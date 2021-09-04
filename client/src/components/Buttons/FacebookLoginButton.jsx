import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import {Button} from "reactstrap";
import React from "react";
import PropTypes from "prop-types";

const FacebookLoginButton = ({onSuccess, onFailure}) => {

    const handleCallback = (res) => {
        console.log(res)
    }

    return <FacebookLogin appId="1257173344724909" callback={handleCallback} render={renderProps => (
        <Button
            className="btn-neutral btn-icon mr-4"
            color="default"
            onClick={() => renderProps.onClick()}
        >
            <span className="btn-inner--icon mr-1">
            <img alt="..." src={require("assets/img/icons/common/facebook.svg")} />
            </span>
            <span className="btn-inner--text">Facebook</span>
        </Button>
    )}/>
}

FacebookLoginButton.prototype = {
    onSuccess: PropTypes.func.isRequired,
    onFailure: PropTypes.func.isRequired,
}

export default FacebookLoginButton