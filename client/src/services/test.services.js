import BaseService from "./base.service.js";
import axios from "axios";
import {Subject} from 'rxjs';

function serviceResolve(res) {
    if (res.status !== 200) {
        throw new Error(res.error);
    }
    return Promise.resolve(res.data);
}

class TestServices extends BaseService {
    constructor() {
        super('/test');
        this.testStatuses = [];
        this.testsSubject = new Subject();
        this.productReceived = this.productReceived.bind(this);
    }

    async getTestStatuses() {
        if (!this.testStatuses || this.testStatuses.length === 0) {
            this.testStatuses = await axios.get(this.baseURL + '/statuses').then(serviceResolve);
        }
        return Promise.resolve(this.testStatuses);
    }

    async productReceived(testId) {
        return axios.post(this.baseURL + "/updateStatus", {testId}).then(serviceResolve);
    }

    async updateStatus(testId, status, params = {}) {
        return axios.post(this.baseURL + "/updateStatus", { testId, status, params }).then(serviceResolve);
    }
}

export default new TestServices();