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
        this.currentUserId = undefined;
        this.role = undefined;
    }

    login(email, password) {
        return axios.post(this.baseURL + '/login', {email, password}).then(serviceResolve);
    }

    register(email, password, role, captcha) {
        return axios.post(this.baseURL + '/register', {email, password, role, captcha}).then(serviceResolve);
    }

    checkToken(token) {
        return new Promise((resolve, reject) => {
            axios.get(this.baseURL + '/checkToken', {token}).then(res => {
                if (res.data.userId) {
                    this.currentUserId = res.data.userId;
                    this.role = res.data.role;
                    resolve();
                }
                reject();
            }).catch(() => {
                this.logout();
                reject();
            });
        });   
    }

    sendResetPasswordMail(email) {
        return axios.post(this.baseURL + "/resetPasswordMail", {email}).then(serviceResolve);
    }

    resetPassword(password, resetPasswordToken) {
        return axios.post(this.baseURL + "/resetPassword", {password, resetPasswordToken}).then(serviceResolve);
    }

    updatePassword(previousPassword, password) {
        return axios.post(this.baseURL + "/updatePassword", {previousPassword, password}).then(serviceResolve);
    }

    emailValidation(userId) {
        return axios.post(this.baseURL + "/emailValidation", {userId}).then(serviceResolve);
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

    isAlreadyChecked() {
        return this.currentUserId !== undefined;
    }

    getRole() {
        return this.role;
    }
}

export default new UserService();