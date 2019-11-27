import BaseService from "./base.service.js";
import axios from "axios";

function serviceResolve(res) {
    if (res.status !== 200) {
        const error = new Error(res.error);
        throw error;
    }
    return Promise.resolve(res.data);
}

class ProductService extends BaseService {
    constructor() {
        super('/product');
    }

    scrapFromAsin(asin) {
        return axios.get(this.baseURL + "/srapFromAsin/" + asin).then(serviceResolve);
    }
}

export default new ProductService();