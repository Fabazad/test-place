import axios from "axios";
import { toast } from 'react-toastify';

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    toast.error(error.response.data ? error.response.data  : error.response.statusText);
    return Promise.reject(error);
  });