import i18n from "i18next";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import constants from "../helpers/constants";
import userService from "../services/user.services";
import FacebookLoginButton from "./Buttons/FacebookLoginButton";
import GoogleLoginButton from "./Buttons/GoogleLoginButton";

const { USER_ROLES } = constants;

const SocialLogin = ({ children, onStartLogging, onStopLogging, className, roles }) => {
  const [loading, setLoading] = useState(undefined);
  const history = useHistory();

  useEffect(() => {
    if (loading !== undefined) {
      if (loading && onStartLogging !== undefined) onStartLogging();
      else if (onStopLogging !== undefined) onStopLogging();
    }
  }, [loading]);

  const googleLogin = async ({ credential }) => {
    setLoading(true);
    try {
      const res = await userService.googleLogin({ credential, keepConnection: true });
      history.push(
        res.user.roles.includes(USER_ROLES.SELLER) ? "/dashboard/my-products" : "/"
      );
    } finally {
      setLoading(false);
    }
  };

  const googleRegister = async ({ credential, roles }) => {
    setLoading(true);
    try {
      const res = await userService.googleRegister({
        credential,
        roles,
        language: i18n.language,
      });
      history.push(
        res.user.roles.includes(USER_ROLES.SELLER) ? "/dashboard/my-products" : "/"
      );
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignInSuccess = async (res) => {
    setLoading(true);
    try {
      const { credential } = res;

      if (roles === undefined) {
        return googleLogin({ credential });
      }

      return googleRegister({ credential, roles, language: i18n.language });
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignInFail = (res) => {
    console.log(res);
    toast.error(res.error);
  };

  const facebookRegister = async ({ accessToken, roles, ...rest }) => {
    setLoading(true);
    try {
      const res = await userService.facebookRegister({
        accessToken,
        roles,
        language: i18n.language,
      });
      history.push(
        res.user.roles.includes(USER_ROLES.SELLER) ? "/dashboard/my-products" : "/"
      );
    } finally {
      setLoading(false);
    }
  };

  const facebookLogin = async ({ accessToken, keepConnection }) => {
    setLoading(true);
    try {
      const res = await userService.facebookLogin({ accessToken, keepConnection });
      history.push(
        res.user.roles.includes(USER_ROLES.SELLER) ? "/dashboard/my-products" : "/"
      );
    } finally {
      setLoading(false);
    }
  };

  const onFacebookSignInSuccess = (res) => {
    const { accessToken } = res;

    if (roles === undefined) {
      return facebookLogin({ accessToken, keepConnection: true });
    }

    return facebookRegister({ accessToken, roles });
  };

  const onFacebookSignInFail = (res) => {
    toast.error(res.error[0].toString());
  };

  return (
    <div className={className || ""}>
      <div className="text-muted text-center mb-3">
        <small>{children}</small>
      </div>
      <div className="text-center">
        <FacebookLoginButton
          onSuccess={onFacebookSignInSuccess}
          onFailure={onFacebookSignInFail}
          disabled={loading}
        />
        <GoogleLoginButton
          onSuccess={onGoogleSignInSuccess}
          onFailure={onGoogleSignInFail}
          disabled={loading}
        />
      </div>
    </div>
  );
};

SocialLogin.prototype = {
  roles: PropTypes.arrayOf(PropTypes.string),
  onStartLogging: PropTypes.func,
  onStopLogging: PropTypes.func,
  className: PropTypes.string,
};

export default SocialLogin;
