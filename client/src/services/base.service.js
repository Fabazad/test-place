import axios from "axios";
import constants from "./../helpers/constants.js";
require("dotenv").config();

class BaseService {

    baseURL;

    constructor(path) {
        this.baseURL = (() => {
            if (process.env.NODE_ENV === "production") {
                return "https://" + window.location.hostname + "/api" + path;
            }
            else {
                return constants.SERVER_DEV_URL + "/api" + path;
            }
        })();
    }

    serviceResolve(res) {
        if (res.status !== 200) {
            return Promise.reject(new Error(res.error));
        }
        return Promise.resolve(res.data);
    }

    getOne(itemId) {
        itemId = itemId ? itemId : '';
        return axios.get(this.baseURL + '/' + itemId).then(this.serviceResolve);
    }

    create(item, options = {}) {
        return axios.post(this.baseURL + "/create", {item, options}).then(this.serviceResolve);
    }

    update(itemId, fields) {
        return axios.post(this.baseURL + "/update", {itemId, fields}).then(this.serviceResolve);
    }

    find(query = {}) {
        return axios.get(this.baseURL + "/find", { params: query }).then(this.serviceResolve);
    }

    delete(itemId) {
        return axios.delete(this.baseURL + '/' + itemId).then(this.serviceResolve);
    }

    post(path, params, serviceResolve = this.serviceResolve) {
        return axios.post(this.baseURL + '/' + path, params).then(serviceResolve);
    }
}

export default BaseService;