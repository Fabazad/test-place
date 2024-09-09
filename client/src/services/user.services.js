import axios from "axios";
import i18n from "i18next";
import { Subject } from "rxjs";
import { setCookie } from "../helpers/cookies";
import { eraseCookie } from "../helpers/cookies.js";
import BaseService from "./base.service.js";
import testServices from "./test.services";

class UserService extends BaseService {
  constructor() {
    super("/user");
    this.currentUser = undefined;
    this.currentUserSubject = new Subject();
    this.currentUserResolve = this.currentUserResolve.bind(this);
  }

  async currentUserResolve(res) {
    const data = await this.serviceResolve(res);
    if (typeof data === "object" && "user" in data) {
      this.currentUser = data.user;
      this.currentUserSubject.next(this.currentUser);
      if (data.user !== null) {
        window.$crisp.push(["set", "user:email", [data.user.email]]);
        const userDataArray = Object.entries(data.user).map(([key, value]) => {
          return [key, value !== null ? value.toString() : "null"];
        });
        window.$crisp.push(["set", "session:data", [userDataArray]]);
        if (data.user.language && i18n.language !== data.user.language)
          i18n.changeLanguage(data.user.language);
      }
      if (
        "requestedTestsCount" in data ||
        "processingTestsCount" in data ||
        "completedTestsCount" in data ||
        "cancelledTestsCount" in data ||
        "guiltyTestsCount" in data
      ) {
        testServices.testGlobalStatusesCountSubject.next(data);
      }
    } else if (this.isAuth() && !data.check) {
      this.logout();
    }
    if (typeof data === "object" && "token" in data) {
      setCookie("token", data.token, 7);
    }
    return data;
  }

  async login(email, password, keepConnection) {
    return this.enrichResponseWithError(async () => {
      const response = await axios.post(this.baseURL + "/login", {
        email,
        password,
        keepConnection,
      });
      return this.currentUserResolve(response);
    });
  }

  async register(user) {
    return this.enrichResponseWithError(axios.post(this.baseURL + "/register", user));
  }

  checkToken() {
    return axios
      .get(this.baseURL + "/checkToken", {
        params: { logged: this.isAuth() },
      })
      .then(this.currentUserResolve)
      .catch(() => this.logout());
  }

  async sendResetPasswordMail(email) {
    return this.enrichResponseWithError(() =>
      axios.post(this.baseURL + "/resetPasswordMail", { email })
    );
  }

  resetPassword(password, resetPasswordToken) {
    return axios
      .post(this.baseURL + "/resetPassword", { password, resetPasswordToken })
      .then(this.serviceResolve);
  }

  updatePassword(previousPassword, password) {
    return axios
      .post(this.baseURL + "/updatePassword", { previousPassword, password })
      .then(this.serviceResolve);
  }

  emailValidation(userId) {
    return axios.post(this.baseURL + "/emailValidation", { userId });
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
    return this.enrichResponseWithError(() =>
      axios.post(this.baseURL + "/validationMail", { email })
    );
  }

  updateUserInfo(userId, data) {
    return axios
      .post(this.baseURL + "/updateUserInfo", { userId, data })
      .then(this.currentUserResolve);
  }

  sendContactUsMessage(name, email, message) {
    return axios
      .post(this.baseURL + "/contact-us", { name, email, message })
      .then(this.serviceResolve);
  }

  changeGender(gender) {
    return this.post("change-gender", { gender }, this.currentUserResolve);
  }

  googleRegister({ credential, roles, language }) {
    return this.enrichResponseWithError(() =>
      axios
        .post(this.baseURL + "/google-register", { credential, roles, language })
        .then(this.currentUserResolve)
    );
  }

  googleLogin({ credential, keepConnection }) {
    return this.enrichResponseWithError(() =>
      axios
        .post(this.baseURL + "/google-login", { credential, keepConnection })
        .then(this.currentUserResolve)
    );
  }

  facebookRegister({ accessToken, roles, language }) {
    return axios
      .post(this.baseURL + "/facebook-register", { accessToken, roles, language })
      .then(this.currentUserResolve);
  }

  facebookLogin({ accessToken, keepConnection }) {
    return axios
      .post(this.baseURL + "/facebook-login", {
        accessToken,
        keepConnection,
      })
      .then(this.currentUserResolve);
  }

  updateLanguage({ language }) {
    return this.post("update-language", { language }, this.currentUserResolve);
  }
}

export default new UserService();
