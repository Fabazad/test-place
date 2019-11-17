import BaseService from "./base.service.js";
import axios from "axios";
import { eraseCookie } from "helpers/cookies.js";

function serviceResolve(res) {
    if (res.status !== 200) {
        const error = new Error(res.error);
        throw error;
    }
    return Promise.resolve(res.data);
}

class UserService extends BaseService {
    constructor() {
        super('/user');
        this.currentUserId = null;
    }

    login(email, password) {
        return axios.post(this.baseURL + '/login', {email, password}).then(serviceResolve);
    }

    register(email, password, captcha) {
        return axios.post(this.baseURL + '/register', {email, password, captcha}).then(serviceResolve);
    }

    checkToken(token) {
        return axios.get(this.baseURL + '/checkToken', {token}).then(res => {
            if (res.data.userId) {
                this.currentUserId = res.data.userId;
            }
        }).catch(() => this.logout());
    }

    sendResetPasswordMail(email) {
        return axios.post(this.baseURL + "/resetPasswordMail", {email}).then(serviceResolve);
    }

    resetPassword(password, resetPasswordToken) {
        return axios.post(this.baseURL + "/resetPassword", {password, resetPasswordToken}).then(serviceResolve);
    }

    getCurrentUserId(){
        return this.currentUserId;
    }

    isAuth() {
        return !!this.currentUserId;
    }

    logout() {
        eraseCookie("token");
        this.currentUserId = null;
    }
}

export default new UserService();