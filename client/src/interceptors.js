import axios from "axios";
import { toast } from 'react-toastify';
import { getCookie } from "helpers/cookies"

axios.interceptors.request.use(function (request) {
  request.headers['x-access-token'] = getCookie("token");
  return request;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    toast.error(error.response.data ? error.response.data  : error.response.statusText);
    console.log(error.response.data ? error.response.data  : error.response.statusText);
    return Promise.reject(error);
  });