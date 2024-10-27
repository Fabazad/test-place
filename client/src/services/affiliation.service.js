import axios from "axios";
import BaseService from "./base.service";

class AffiliationService extends BaseService {
  constructor() {
    super("/affiliation");
  }

  getAffiliated({ page, itemsPerPage }) {
    return axios
      .get(this.baseURL + "/affiliated", { params: { page, itemsPerPage } })
      .then(this.serviceResolve);
  }

  getLastAffiliationRecords({ page, itemsPerPage }) {
    return axios
      .get(this.baseURL + "/lastRecords", { params: { page, itemsPerPage } })
      .then(this.serviceResolve);
  }

  getUserAffiliationSummary() {
    return axios.get(this.baseURL + "/affiliationSummary").then(this.serviceResolve);
  }
}

export const AffiliationServices = new AffiliationService();
