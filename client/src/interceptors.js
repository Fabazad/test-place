import axios from "axios";
import {toast} from 'react-toastify';
import {getCookie} from "helpers/cookies"
import userServices from "services/user.services";

axios.interceptors.request.use(function (request) {
    request.headers['x-access-token'] = getCookie("token");
    return request;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    let message;
    if (error.response) {
        message = error.response.data ?
            (error.response.data.message ? error.response.data.message : error.response.data) :
            error.response.statusText;
    } else {
        message = error;
    }

    if (error.response && error.response.status && error.response.status === 401) {
        userServices.logout();
        window.location.replace("/");
    }

    if (message === "account_already_exists") message = "Ce compte existe déjà.";
    if (message === "not_registered_yet") message = "Vous n'êtes pas encore inscris.";
    if (message === "facebook_account_missing_email") message = "Il manque une adresse mail validée sur votre compte Facebook.";

    toast.error(message);

    return Promise.reject(error);
});