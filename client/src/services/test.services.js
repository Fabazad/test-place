import axios from "axios";
import { Subject } from "rxjs";
import BaseService from "./base.service.js";

class TestServices extends BaseService {
  constructor() {
    super("/test");
    this.testStatuses = [];
    this.testsSubject = new Subject();
    this.updateStatus = this.updateStatus.bind(this);

    this.testGlobalStatusesCount = null;

    this.testGlobalStatusesCountSubject = new Subject();
    this.testCountSubject = new Subject();
    this.testGlobalStatusesCountSubject.subscribe((val) => {
      this.testGlobalStatusesCount = {
        requested: val.requestedTestsCount,
        processing: val.processingTestsCount,
        completed: val.completedTestsCount,
        cancelled: val.cancelledTestsCount,
        guilty: val.guiltyTestsCount,
      };
      this.testCountSubject.next(this.testGlobalStatusesCount);
    });
  }

  async getTestStatuses() {
    if (!this.testStatuses || this.testStatuses.length === 0) {
      this.testStatuses = await axios
        .get(this.baseURL + "/statuses")
        .then(this.serviceResolve);
    }
    return Promise.resolve(this.testStatuses);
  }

  async updateStatus(testId, status, params = {}) {
    const response = await axios
      .post(this.baseURL + "/updateStatus", {
        testId,
        update: { status, params },
      })
      .then(this.serviceResolve);
    if (
      "requestedTestsCount" in response ||
      "processingTestsCount" in response ||
      "completedTestsCount" in response ||
      "cancelledTestsCount" in response ||
      "guiltyTestsCount" in response
    ) {
      this.testGlobalStatusesCountSubject.next(response);
    }
    return response.test;
  }

  create(item) {
    return this.enrichResponseWithError(() =>
      axios.post(this.baseURL + "/create", item).then(this.serviceResolve)
    );
  }

  sendMessage(item) {
    return this.enrichResponseWithError(() =>
      axios.post(this.baseURL + "/addMessage", item).then(this.serviceResolve)
    );
  }
}

export default new TestServices();
