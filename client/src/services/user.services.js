import testServices from './test.services';
import BaseService from "./base.service.js";
import axios from "axios";
import {eraseCookie} from "../helpers/cookies.js";
import {Subject} from "rxjs";
import {setCookie} from "../helpers/cookies";

class UserService extends BaseService {
    constructor() {
        super('/user');
        this.currentUser = undefined;
        this.currentUserSubject = new Subject();
        this.currentUserResolve = this.currentUserResolve.bind(this);
    }

    async currentUserResolve(res) {
        return new Promise((resolve, reject) => {
            this.serviceResolve(res)
                .then(data => {
                    if (typeof data === "object" && "user" in data) {
                        this.currentUser = data.user;
                        this.currentUserSubject.next(this.currentUser);
                        if ('requestedTestsCount' in data
                            || 'processingTestsCount' in data
                            || 'completedTestsCount' in data
                            || 'cancelledTestsCount' in data
                            || 'guiltyTestsCount' in data) {
                            testServices.testGlobalStatusesCountSubject.next(data);
                        }
                    } else if (this.isAuth() && !data.check) {
                        this.logout();
                    }
                    if (typeof data === "object" && "token" in data) {
                        setCookie("token", data.token, 7);
                    }
                    return resolve(data);
                })
                .catch(err => reject(err));
        });

    }

    login(email, password, keepConnection) {
        return axios.post(this.baseURL + '/login', {email, password, keepConnection})
            .then(this.currentUserResolve);
    }

    register(user) {
        return axios.post(this.baseURL + '/register', user).then(this.serviceResolve);
    }

    checkToken() {
        return axios.get(this.baseURL + '/checkToken', {
            params: {logged: this.isAuth()}
        }).then(this.currentUserResolve);
    }

    sendResetPasswordMail(email) {
        return axios.post(this.baseURL + "/resetPasswordMail", {email}).then(this.serviceResolve);
    }

    resetPassword(password, resetPasswordToken) {
        return axios.post(this.baseURL + "/resetPassword", {password, resetPasswordToken}).then(this.serviceResolve);
    }

    updatePassword(previousPassword, password) {
        return axios.post(this.baseURL + "/updatePassword", {previousPassword, password}).then(this.serviceResolve);
    }

    emailValidation(userId) {
        return axios.post(this.baseURL + "/emailValidation", {userId}).then(this.serviceResolve);
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

    hasRole(role) {
        if (this.isAuth() && this.currentUser.roles) {
            return this.currentUser.roles.reduce((prev, currentRole) => {
                return prev || currentRole === role;
            }, false);
        }
        return false;
    }

    resendValidationMail(email) {
        return axios.post(this.baseURL + "/validationMail", {email}).then(this.serviceResolve);
    }

    updateUserInfo(userId, data) {
        return axios.post(this.baseURL + "/updateUserInfo", {userId, data}).then(this.currentUserResolve);
    }

    sendContactUsMessage(name, email, message) {
        return axios.post(this.baseURL + "/contact-us", {name, email, message}).then(this.serviceResolve);
    }

    changeGender(gender) {
        return this.post("change-gender", { gender }, this.currentUserResolve);
    }
}

export default new UserService();