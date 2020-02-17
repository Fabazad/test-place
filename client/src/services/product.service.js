import BaseService from "./base.service.js";
import axios from "axios";
import { Subject } from 'rxjs';

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
        this.productsUpdatedSubject = new Subject();
    }

    scrapFromAsin(asin) {
        return axios.get(this.baseURL + "/srapFromAsin/" + asin).then(serviceResolve);
    }

    async getProductCategories() {
        if (!this.categories || !this.categories.length > 0) {
            this.categories = await axios.get(this.baseURL + '/categories').then(serviceResolve);
        }
        return Promise.resolve(this.categories);
    }
}

export default new ProductService();