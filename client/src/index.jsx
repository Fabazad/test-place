import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga4";

import "assets/scss/style.scss";
import "assets/vendor/nucleo/css/nucleo.css";

import "assets/scss/argon-design-system-react.scss";

import "assets/dashboard/scss/argon-dashboard-react.scss";

import "react-toastify/dist/ReactToastify.css";

import "@fortawesome/fontawesome-free/css/all.min.css";

import "./translation/i18n";

import App from "./App";

import TagManager from "react-gtm-module";
TagManager.initialize({ gtmId: "G-RJRV0M98R9" });
ReactGA.initialize("G-RJRV0M98R9");

ReactDOM.render(<App />, document.getElementById("root"));
