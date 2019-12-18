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
        this.amazonId = undefined;
    }

    login(email, password) {
        return axios.post(this.baseURL + '/login', {email, password}).then(serviceResolve);
    }

    register(user) {
        return axios.post(this.baseURL + '/register', user).then(serviceResolve);
    }

    checkToken(token) {
        return new Promise((resolve, reject) => {
            axios.get(this.baseURL + '/checkToken', {token}).then(res => {
                if (res.data.userId) {
                    this.currentUserId = res.data.userId;
                    this.role = res.data.role;
                    this.amazonId = res.data.amazonId;
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

    getAmazonId() {
        return this.amazonId;
    }

    amazonLogin(token) {
        return axios.post(this.baseURL + "/amazonLogin", { token }).then(serviceResolve);
    }
}

export default new UserService();