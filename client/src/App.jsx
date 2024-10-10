import i18n from "i18next";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { LastLocationProvider } from "react-router-last-location";
import { ToastContainer } from "react-toastify";
import userService from "../src/services/user.services";
import ConfirmModal from "./components/Modals/ConfirmModal";
import ScrollToTop from "./components/ScrollTop";
import anyAuth from "./helpers/anyAuth";
import withAuth from "./helpers/withAuth";
import withoutAuth from "./helpers/withoutAuth";
import history from "./history";
import { runInterceptors } from "./interceptors";
import DashboardLayout from "./layouts/Dashboard";
import EmailValidation from "./views/EmailValidation";
import Landing from "./views/Landing/Landing";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import ProductDetail from "./views/ProductDetail";
import Register from "./views/Register";
import ResetPassword from "./views/ResetPassword";
import Search from "./views/Search";

const App = () => {
  useEffect(() => {
    const localStorageLanguage = localStorage.getItem("language");
    if (localStorageLanguage && localStorageLanguage === "fr") {
      i18n.changeLanguage("fr");
    }
    if (localStorageLanguage && localStorageLanguage === "ch") {
      i18n.changeLanguage("ch");
    }
    if (localStorageLanguage && localStorageLanguage === "bd") {
      i18n.changeLanguage("bd");
    } else {
      if (navigator.language.startsWith("fr")) {
        i18n.changeLanguage("fr");
      }
      if (navigator.language.startsWith("ch")) {
        i18n.changeLanguage("ch");
      }
      if (navigator.language.startsWith("bd")) {
        i18n.changeLanguage("bd");
      }
    }

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "9be250b8-1e0b-46d6-b929-a1ee0981a28a";

    (function () {
      var d = document;
      var s = d.createElement("script");

      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();

    const hasAlreadyReceivedHelpMessage = localStorage.getItem("help-message");
    setTimeout(() => {
      if (userService.currentUser || hasAlreadyReceivedHelpMessage) {
        console.log("CURRENT_USER");
      } else {
        localStorage.setItem("help-message", "true");
        window.$crisp.push(["do", "message:show", ["text", i18n.t("CAN_I_HELP")]]);
      }
    }, 60000);
  }, []);

  const { t } = useTranslation();

  runInterceptors(history, t);
  return (
    <>
      <ToastContainer data-testid="toast-container" />
      <ConfirmModal />
      <Router history={history}>
        <ScrollToTop />
        <LastLocationProvider>
          <Switch>
            <Route path="/" exact component={anyAuth(Landing)} />
            <Route path="/login" component={withoutAuth(Login)} />
            <Route path="/register" component={withoutAuth(Register)} />,
            <Route
              path="/reset-password/:resetPasswordToken"
              component={withoutAuth(ResetPassword)}
            />
            <Route
              path="/email-validation/:userId"
              component={withoutAuth(EmailValidation)}
            />
            <Route path="/dashboard" component={withAuth(DashboardLayout)} />
            <Route path="/search" component={anyAuth(Search)} />
            <Route path="/ad/:productId" component={anyAuth(ProductDetail)} />
            <Route path="/not-found" component={anyAuth(NotFound)} />
            <Redirect to="/not-found" />
          </Switch>
        </LastLocationProvider>
      </Router>
    </>
  );
};

export default App;
