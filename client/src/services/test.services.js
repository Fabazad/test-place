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

class TestServices extends BaseService {
    constructor() {
        super('/test');
        this.testStatuses = [];
    }

    async getTestStatuses() {
        if (this.testStatuses && this.testStatuses.length > 0) {
            this.testStatuses = await axios.get(this.baseURL + '/statuses').then(serviceResolve);
        }
        return Promise.resolve(this.testStatuses);
    }
}

export default new TestServices();