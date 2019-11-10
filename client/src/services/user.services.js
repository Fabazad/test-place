import BaseService from "./base.service.js";
import axios from "axios";

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
    }

    login(email, password) {
        return axios.post(this.baseURL + '/login', {email, password}).then(serviceResolve);
    }

    register(name, email, password) {
        return axios.post(this.baseURL + '/register', {name, email, password}).then(serviceResolve);
    }
}

export default new UserService();