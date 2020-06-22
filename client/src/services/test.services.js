import BaseService from "./base.service.js";
import axios from "axios";
import {Subject} from 'rxjs';

class TestServices extends BaseService {
    constructor() {
        super('/test');
        this.testStatuses = [];
        this.testsSubject = new Subject();
        this.updateStatus = this.updateStatus.bind(this);

        this.testGlobalStatusesCount = null;

        this.testGlobalStatusesCountSubject = new Subject();
        this.testCountSubject = new Subject();
        this.testGlobalStatusesCountSubject.subscribe(val => {
            this.testGlobalStatusesCount = {
                requested: val.requestedTestsCount,
                processing: val.processingTestsCount,
                completed: val.completedTestsCount
            };
            this.testCountSubject.next(this.testGlobalStatusesCount);
        })
    }

    async getTestStatuses() {
        if (!this.testStatuses || this.testStatuses.length === 0) {
            this.testStatuses = await axios.get(this.baseURL + '/statuses').then(this.serviceResolve);
        }
        return Promise.resolve(this.testStatuses);
    }

    async updateStatus(testId, status, params = {}) {
        const response = await axios.post(this.baseURL + "/updateStatus", {
            testId,
            status,
            params
        }).then(this.serviceResolve);
        if ('requestedTestsCount' in response
            || 'processingTestsCount' in response
            || 'completedTestsCount' in response
        ) {
            this.testGlobalStatusesCountSubject.next(response);
        }
        return response.test;
    }
}

export default new TestServices();