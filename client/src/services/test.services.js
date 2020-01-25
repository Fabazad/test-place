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
    }
}

export default new TestServices();