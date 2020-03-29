import BaseService from "./base.service.js";
import axios from "axios";
import {eraseCookie} from "../helpers/cookies.js";
import {Subject} from "rxjs";

function serviceResolve(res) {
    if (!res || res.status !== 200) {
        return Promise.reject(new Error(res.error));
    }
    return Promise.resolve(res.data);
}

class UserService extends BaseService {
    constructor() {
        super('/user');
        this.currentUser = undefined;
        this.currentUserSubject = new Subject();
        this.currentUserResolve = this.currentUserResolve.bind(this);
    }

    async currentUserResolve(res) {
        return new Promise((resolve, reject) => {
            serviceResolve(res)
                .then(data => {
                    if (typeof data === "object" && "user" in data) {
                        this.currentUser = data.user;
                        this.currentUserSubject.next(this.currentUser);
                    } else if (this.isAuth() && !data.check) {
                        this.logout();
                    }
                    return resolve(data);
                })
                .catch(err => reject(err));
        });

    }

    login(email, password) {
        return axios.post(this.baseURL + '/login', {email, password}).then(this.currentUserResolve);
    }

    register(user) {
        return axios.post(this.baseURL + '/register', user).then(serviceResolve);
    }

    checkToken() {
        return axios.get(this.baseURL + '/checkToken', {
            params: {logged: this.isAuth()}
        }).then(this.currentUserResolve);
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

    getCurrentUserId() {
        return this.isAuth() ? this.currentUser._id : null;
    }

    isAuth() {
        return !!this.currentUser;
    }

    logout() {
        eraseCookie("token");
        this.currentUser = undefined;
        this.currentUserSubject.next();
    }

    isAlreadyChecked() {
        return this.currentUser !== undefined;
    }

    getAmazonId() {
        return this.currentUser.amazonId;
    }

    amazonLogin(amazonToken) {
        return axios.post(this.baseURL + "/amazonLogin", {amazonToken}).then(this.currentUserResolve);
    }

    resendValidationMail(email) {
        return axios.post(this.baseURL + "/validationMail", {email}).then(serviceResolve);
    }

    updateUserInfo(userId, data) {
        return axios.post(this.baseURL + "/updateUserInfo", {userId, data}).then(this.currentUserResolve);
    }
}

export default new UserService();