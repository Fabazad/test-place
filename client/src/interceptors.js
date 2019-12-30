import axios from "axios";
import {toast} from 'react-toastify';
import {getCookie} from "helpers/cookies"

axios.interceptors.request.use(function (request) {
    request.headers['x-access-token'] = getCookie("token");
    request.headers['protocol'] = window.location.protocol.replace(':', '');
    console.log(request.headers);
    return request;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response) {
        const message = error.response.data ?
            (error.response.data.message ? error.response.data.message : error.response.data) :
            error.response.statusText;
        toast.error(message);
    } else {
        toast.error(error);
    }
    return Promise.reject(error);
});