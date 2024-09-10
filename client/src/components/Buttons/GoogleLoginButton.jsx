import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { Button } from "reactstrap";

const GoogleLoginButton = ({ onSuccess, onFailure, disabled }) => {
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleLogin;
      document.body.appendChild(script);
    };

    const handleCredentialResponse = (response) => {
      console.log({ response });
      if (response.credential) {
        onSuccess(response);
      } else {
        onFailure(new Error("Google sign-in failed"));
      }
    };

    const initializeGoogleLogin = () => {
      if (window.google) {
        console.log("Initialized");
        window.google.accounts.id.initialize({
          client_id:
            "551740391673-sidds0lingiqeli1jro82a0djidgjj3e.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });

        // Store the client for later use when the button is clicked
        googleButtonRef.current = window.google.accounts.id;
      }
    };

    if (!window.google?.accounts) {
      loadGoogleScript();
    } else {
      loadGoogleScript();
      initializeGoogleLogin();
    }
  }, [onSuccess, onFailure]);

  const handleClick = () => {
    console.log({ googleButtonRef });
    if (googleButtonRef.current) {
      googleButtonRef.current.prompt(); // Manually trigger the Google sign-in prompt
      console.log("Prompt");
    }
  };

  return (
    <Button
      className="btn-neutral btn-icon ml-1 text-dark"
      color="default"
      disabled={disabled}
      onClick={handleClick}
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
  disabled: PropTypes.bool,
};

export default GoogleLoginButton;
