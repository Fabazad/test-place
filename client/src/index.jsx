import React from "react";
import ReactDOM from "react-dom";

import "assets/dashboard/scss/argon-dashboard-react.scss";
import "assets/scss/argon-design-system-react.scss";
import "assets/scss/style.scss";
import "assets/vendor/nucleo/css/nucleo.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import "./translation/i18n";

import ReactGA from "react-ga";
ReactGA.initialize("UA-153363667-2");

ReactDOM.render(<App />, document.getElementById("root"));
