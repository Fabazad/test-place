import React from "react";
import ReactDOM from "react-dom";

import "assets/scss/style.scss";
import "assets/vendor/nucleo/css/nucleo.css";
import "assets/scss/argon-design-system-react.scss";
import "assets/dashboard/scss/argon-dashboard-react.scss";


import "interceptors";
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import './translation/i18n';
import App from "./App";

import ReactGA from 'react-ga';
ReactGA.initialize('UA-153363667-2');


ReactDOM.render( <App/>,
    document.getElementById("root")
);
