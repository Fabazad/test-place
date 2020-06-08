import axios from "axios";
import constants from "./../helpers/constants.js";
require("dotenv").config();

class BaseService {

    baseURL;

    constructor(path) {
        this.baseURL =
            (process.env.ENV === 'PROD' ? constants.SERVER_PROD_URL :
                (process.env.ENV === 'STAGE' ? constants.SERVER_STAGE_URL :
                constants.SERVER_DEV_URL)) + "/api" + path;
    }

    serviceResolve(res) {
        if (res.status !== 200) {
            throw new Error(res.error);
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

    post(path, params) {
        return axios.post(this.baseURL + '/' + path, params).then(this.serviceResolve);
    }
}

export default BaseService;