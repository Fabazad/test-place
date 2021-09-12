import FacebookLoginButton from "./Buttons/FacebookLoginButton";
import GoogleLoginButton from "./Buttons/GoogleLoginButton";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import userService from "../services/user.services";
import {toast} from "react-toastify";
import constants from "../helpers/constants";
import {useHistory} from "react-router-dom";

const {USER_ROLES} = constants

const SocialLogin = ({children, onStartLogging, onStopLogging, className, roles}) => {

    const [loading, setLoading] = useState(undefined);
    const history = useHistory()

    useEffect(() => {
        if (loading !== undefined) {
            if (loading && onStartLogging !== undefined) onStartLogging();
            else if (onStopLogging !== undefined) onStopLogging();
        }
    }, [loading])

    const googleLogin = async ({googleId}) => {
        setLoading(true);
        try {
            const res = await userService.googleLogin({googleId, keepConnection: true});
            history.push(res.user.roles.includes(USER_ROLES.SELLER) ? '/dashboard/my-products' : '/');
        } finally {
            setLoading(false);
        }
    }

    const googleRegister = async ({name, email, roles, googleId}) => {
        setLoading(true);
        try {
            const res = await userService.googleRegister({name, email, roles, googleId});
            history.push(res.user.roles.includes(USER_ROLES.SELLER) ? '/dashboard/my-products' : '/');
        } finally {
            setLoading(false);
        }
    }

    const onGoogleSignInSuccess = async (res) => {
        const {profileObj} = res;
        const {email, givenName, googleId, name} = profileObj;

        if (roles === undefined) {
            return googleLogin({googleId})
        }

        const builtName = (givenName || name) + Math.round(Math.random() * 10000)
        return googleRegister({name: builtName, email, roles, googleId});


    }

    const onGoogleSignInFail = (res) => {
        toast.error(res.error[0].toString());
    }

    const facebookRegister = async ({accessToken, roles}) => {
        setLoading(true);
        try {
            const res = await userService.facebookRegister({accessToken, roles});
            history.push(res.user.roles.includes(USER_ROLES.SELLER) ? '/dashboard/my-products' : '/');
        } finally {
            setLoading(false);
        }
    }

    const facebookLogin = async ({accessToken, keepConnection}) => {
        setLoading(true);
        try {
            const res = await userService.facebookLogin({accessToken, keepConnection});
            history.push(res.user.roles.includes(USER_ROLES.SELLER) ? '/dashboard/my-products' : '/');
        } finally {
            setLoading(false);
        }
    }

    const onFacebookSignInSuccess = (res) => {
        const {accessToken} = res;

        if (roles === undefined) {
            return facebookLogin({accessToken, keepConnection: true})
        }

        return facebookRegister({accessToken, roles});
    }

    const onFacebookSignInFail = (res) => {
        toast.error(res.error[0].toString());
    }

    return <div className={className || ""}>
        <div className="text-muted text-center mb-3">
            <small>{children}</small>
        </div>
        <div className="text-center">
            <FacebookLoginButton onSuccess={onFacebookSignInSuccess}
                                 onFailure={onFacebookSignInFail} disabled={loading}/>
            <GoogleLoginButton onSuccess={onGoogleSignInSuccess}
                               onFailure={onGoogleSignInFail} disabled={loading}/>
        </div>
    </div>
}

SocialLogin.prototype = {
    roles: PropTypes.arrayOf(PropTypes.string),
    onStartLogging: PropTypes.func,
    onStopLogging: PropTypes.func,
    className: PropTypes.string
}

export default SocialLogin