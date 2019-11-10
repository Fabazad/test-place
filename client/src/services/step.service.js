import BaseService from "./base.service.js";

class StepService extends BaseService {
    constructor() {
        super('/step');
    }
}

export default new StepService();