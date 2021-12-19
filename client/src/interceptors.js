import axios from "axios";
import {toast} from 'react-toastify';
import {getCookie} from "helpers/cookies"
import userServices from "services/user.services";
import {errorMessages} from "./helpers/errorMessages";

let requestInterceptorId;
let responseInterceptorId;
export const runInterceptors = (history, t) => {

    axios.interceptors.request.eject(requestInterceptorId);
    axios.interceptors.response.eject(responseInterceptorId);

    responseInterceptorId = axios.interceptors.request.use(function (request) {
        request.headers['x-access-token'] = getCookie("token");
        return request;
    }, function (error) {
        return Promise.reject(error);
    });

    requestInterceptorId = axios.interceptors.response.use(function (response) {
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
            history.push("/");
        }

        const newMessage = errorMessages(t)[message];
        if (newMessage !== undefined) message = newMessage;

        if (message === "not_registered_yet") {
            history.push("/register")
        }

        toast.error(message);

        return Promise.reject(error);
    });
}