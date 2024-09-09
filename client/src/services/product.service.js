import axios from "axios";
import dayjs from "dayjs";
import { Subject } from "rxjs";
import BaseService from "./base.service.js";

function serviceResolve(res) {
  if (res.status !== 200) {
    const error = new Error(res.error);
    throw error;
  }
  return Promise.resolve(res.data);
}

class ProductService extends BaseService {
  constructor() {
    super("/product");
    this.categories = [];
    this.productsUpdatedSubject = new Subject();
  }

  async scrapFromAsin(asin) {
    return axios.get(this.baseURL + "/srapFromAsin/" + asin).then(serviceResolve);
  }

  async getProductCategories() {
    if (!this.categories || !this.categories.length > 0) {
      this.categories = await axios
        .get(this.baseURL + "/categories")
        .then(serviceResolve);
    }
    return Promise.resolve(this.categories);
  }

  isPublished(product) {
    return (
      product &&
      product.publishExpirationDate &&
      dayjs(product.publishExpirationDate).isAfter() &&
      "remainingTestsCount" in product &&
      product.remainingTestsCount > 0
    );
  }

  publish(itemId, published) {
    return axios
      .post(this.baseURL + "/update", { itemId, published })
      .then(this.serviceResolve);
  }
}

export default new ProductService();
