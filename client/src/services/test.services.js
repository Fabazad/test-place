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
    }

    async getTestStatuses() {
        if (!this.testStatuses || this.testStatuses.length === 0) {
            this.testStatuses = await axios.get(this.baseURL + '/statuses').then(serviceResolve);
        }
        return Promise.resolve(this.testStatuses);
    }

    async cancelRequest(testId, cancelReason) {
        return axios.post(this.baseURL + "/cancelRequest", {testId, cancelReason}).then(serviceResolve);
    }

    async declineTestRequest(testId, declineReason) {
        return axios.post(this.baseURL + "/declineRequest", {testId, declineReason}).then(serviceResolve);
    }

    async acceptTestRequest(testId, sellerMessage) {
        return axios.post(this.baseURL + "/acceptRequest", {testId, sellerMessage}).then(serviceResolve);
    }
}

export default new TestServices();