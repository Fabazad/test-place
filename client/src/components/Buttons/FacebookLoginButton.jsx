import PropTypes from "prop-types";
import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { Button } from "reactstrap";

const FacebookLoginButton = ({ onSuccess, onFailure, disabled }) => {
  const handleCallback = (res) => {
    onSuccess(res);
  };

  return (
    <FacebookLogin
      appId="1257173344724909"
      fields="name,email,picture,first_name"
      isMobile={false}
      callback={handleCallback}
      render={(renderProps) => (
        <Button
          disabled={disabled}
          className="btn-neutral btn-icon mr-4 text-dark"
          color="default"
          onClick={() => renderProps.onClick()}
        >
          <span className="btn-inner--icon mr-1">
            <img
              alt="..."
              src={require("assets/img/icons/common/facebook.svg").default}
            />
          </span>
          <span className="btn-inner--text">Facebook</span>
        </Button>
      )}
    />
  );
};

FacebookLoginButton.prototype = {
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
};

export default FacebookLoginButton;
