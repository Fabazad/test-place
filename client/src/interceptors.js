import axios from "axios";
import { getCookie } from "helpers/cookies";
import { toast } from "react-toastify";
import userServices from "services/user.services";
import { errorMessages } from "./helpers/errorMessages";

let requestInterceptorId;
let responseInterceptorId;
export const runInterceptors = (history, t) => {
  axios.interceptors.request.eject(requestInterceptorId);
  axios.interceptors.response.eject(responseInterceptorId);

  responseInterceptorId = axios.interceptors.request.use(
    function (request) {
      request.headers["x-access-token"] = getCookie("token");
      return request;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  requestInterceptorId = axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      let message;
      if (error.response) {
        message = error.response.data
          ? error.response.data.message
            ? error.response.data.message
            : error.response.data
          : error.response.statusText;
      } else {
        message = error;
      }

      if (error?.response?.status === 401) {
        userServices.logout();
        history.push("/");
      }

      const newMessage = errorMessages(t)[message];
      if (newMessage !== undefined) message = newMessage;

      if (message === "not_registered_yet") {
        history.push("/register");
      }

      if (error?.response?.status === 500)
        toast.error(t("UNKNOWN_ERROR") + ": " + message);
      if (error?.response?.status === 400 && error.response.data?.code === "bad-request")
        toast.error(t("BAD_REQUEST_PARAMS"));

      return Promise.reject(error);
    }
  );
};
