import PropTypes from "prop-types";
import React from "react";
import { useGoogleLogin } from "react-google-login";
import { Button } from "reactstrap";

const GoogleLoginButton = ({ onSuccess, onFailure, disabled }) => {
  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId: "165720093757-rekthd2sfe0nn7m0tb7f0bopuquqdfn7.apps.googleusercontent.com",
  });

  return (
    <Button
      className="btn-neutral btn-icon ml-1 text-dark"
      color="default"
      disabled={disabled}
      onClick={() => signIn()}
    >
      <span className="btn-inner--icon mr-1">
        <img alt="..." src={require("assets/img/icons/common/google.svg").default} />
      </span>
      <span className="btn-inner--text">Google</span>
    </Button>
  );
};

GoogleLoginButton.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
};

export default GoogleLoginButton;
