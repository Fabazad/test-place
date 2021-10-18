import React, {useEffect} from "react";
import {ToastContainer} from "react-toastify";
import {Redirect, Route, Switch} from "react-router-dom";
import withoutAuth from "./helpers/withoutAuth";
import Login from "./views/Login";
import Register from "./views/Register";
import anyAuth from "./helpers/anyAuth";
import Landing from "./views/Landing/Landing";
import ResetPassword from "./views/ResetPassword";
import EmailValidation from "./views/EmailValidation";
import withAuth from "./helpers/withAuth";
import DashboardLayout from "./layouts/Dashboard";
import Search from "./views/Search";
import ProductDetail from "./views/ProductDetail";
import ConfirmModal from "./components/Modals/ConfirmModal";
import NotFound from "./views/NotFound";
import {Router} from "react-router-dom";
import history from './history';
import ReactGA from 'react-ga';
import {LastLocationProvider} from 'react-router-last-location';
import ScrollToTop from "./components/ScrollTop";
import {runInterceptors} from "./interceptors";
import i18n from "i18next";

history.listen(location => {
    ReactGA.set({page: location.pathname}); // Update the user's current page
    ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

const App = () => {

    useEffect(() => {
        const localStorageLanguage = localStorage.getItem("language")
        if (localStorageLanguage && localStorageLanguage === "fr") {
            i18n.changeLanguage("fr")
        }
        else {
            if (navigator.language.startsWith("fr")) {
                i18n.changeLanguage("fr")
            }
        }


        window.$crisp = [];
        window.CRISP_WEBSITE_ID = "9be250b8-1e0b-46d6-b929-a1ee0981a28a";

        (function() {
            var d = document;
            var s = d.createElement("script");

            s.src = "https://client.crisp.chat/l.js";
            s.async = 1;
            d.getElementsByTagName("head")[0].appendChild(s);
        })();
    }, []);

    runInterceptors(history)
    return (
        <>
            <ToastContainer data-testid="toast-container"/>
            <ConfirmModal/>
            <Router history={history}>
                <ScrollToTop/>
                <LastLocationProvider>
                    <Switch>
                        <Route path="/" exact component={anyAuth(Landing)}/>
                        <Route path="/login" component={withoutAuth(Login)}/>
                        <Route path="/register" component={withoutAuth(Register)}/>,
                        <Route path="/reset-password/:resetPasswordToken" component={withoutAuth(ResetPassword)}/>
                        <Route path="/email-validation/:userId" component={withoutAuth(EmailValidation)}/>
                        <Route path="/dashboard" component={withAuth(DashboardLayout)}/>
                        <Route path="/search" component={anyAuth(Search)}/>
                        <Route path="/ad/:productId" component={anyAuth(ProductDetail)}/>
                        <Route path="/not-found" component={anyAuth(NotFound)}/>
                        <Redirect to="/not-found"/>
                    </Switch>
                </LastLocationProvider>
            </Router>
        </>
    );
};

export default App;
