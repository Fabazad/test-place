import axios from "axios";

class BaseService {
  baseURL;

  constructor(path) {
    this.baseURL = (() => {
      return window.location.origin + "/api" + path;
    })();
  }

  serviceResolve(res) {
    if (res.status !== 200) throw new Error(res.error);
    return res.data;
  }

  async enrichResponseWithError(fn) {
    try {
      if (typeof fn === "function") {
        const res = await fn();
        return res;
      }
      return fn();
    } catch (err) {
      console.log(err);
      return { error: err.response.data.code };
    }
  }

  getOne(itemId) {
    itemId = itemId ? itemId : "";
    return axios.get(this.baseURL + "/" + itemId).then(this.serviceResolve);
  }

  create(item, options = {}) {
    return axios
      .post(this.baseURL + "/create", { item, options })
      .then(this.serviceResolve);
  }

  update(itemId, fields) {
    return axios
      .post(this.baseURL + "/update", { itemId, fields })
      .then(this.serviceResolve);
  }

  find(query = {}) {
    return axios.get(this.baseURL + "/find", { params: query }).then(this.serviceResolve);
  }

  delete(itemId) {
    return axios.delete(this.baseURL + "/" + itemId).then(this.serviceResolve);
  }

  post(path, params, serviceResolve = this.serviceResolve) {
    return axios.post(this.baseURL + "/" + path, params).then(serviceResolve);
  }
}

export default BaseService;
