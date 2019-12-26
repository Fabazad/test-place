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
        this.categories =  [];
        this.getProductCategories().then(categories => this.categories = categories);
    }

    scrapFromAsin(asin) {
        return axios.get(this.baseURL + "/srapFromAsin/" + asin).then(serviceResolve);
    }

    getProductCategories() {
        if (this.categories && this.categories.length > 0) {
            return Promise.resolve(this.categories);
        } else {
            return axios.get(this.baseURL + '/categories').then(serviceResolve);
        }

    }
}

export default new ProductService();