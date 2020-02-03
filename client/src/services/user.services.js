import BaseService from "./base.service.js";
import axios from "axios";
import {eraseCookie} from "helpers/cookies.js";
import {Subject} from "rxjs";

function serviceResolve(res) {
    return Promise.resolve(res.data);
}

class UserService extends BaseService {
    constructor() {
        super('/user');
        this.currentUserId = undefined;
        this.amazonId = undefined;
        this.currentUser = undefined;
        this.currentUserSubject = new Subject();
        this.currentUserResolve = this.currentUserResolve.bind(this);
    }

    async currentUserResolve(res) {
        const data = await serviceResolve(res);
        if ("user" in data) {
            this.currentUser = data.user;
            this.currentUserSubject.next();
        }
        return Promise.resolve(data);
    }

    login(email, password) {
        return axios.post(this.baseURL + '/login', {email, password}).then(this.currentUserResolve);
    }

    register(user) {
        return axios.post(this.baseURL + '/register', user).then(serviceResolve);
    }

    checkToken(required = true) {
        return new Promise((resolve, reject) => {
            axios.get(this.baseURL + '/checkToken', {params: {required}}).then(res => {
                if (res.data.userId) {
                    this.currentUserId = res.data.userId;
                    this.amazonId = res.data.amazonId;
                    this.currentUserResolve(res).then(resolve);
                } else {
                    reject();
                }
            }).catch((err) => {
                console.log(err);
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

    getCurrentUserId() {
        return this.currentUser._id;
    }

    isAuth() {
        return !!this.currentUser;
    }

    logout() {
        eraseCookie("token");
        this.currentUserId = null;
        this.currentUser = undefined;
        this.currentUserSubject.next();
    }

    isAlreadyChecked() {
        return this.currentUserId !== undefined;
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
}

export default new UserService();