import React from "react";
import ReactDOM from "react-dom";

import "assets/scss/style.scss";
import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss";
import "assets/dashboard/scss/argon-dashboard-react.scss";


import "interceptors";
import 'react-toastify/dist/ReactToastify.css';
import './translation/i18n';
import App from "./App";

ReactDOM.render(
    <App/>,
    document.getElementById("root")
);
