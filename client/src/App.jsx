import React from "react";
import {ToastContainer} from "react-toastify";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import withoutAuth from "./helpers/withoutAuth";
import Login from "./views/Login";
import Register from "./views/Register";
import anyAuth from "./helpers/anyAuth";
import Landing from "./views/Landing";
import ResetPassword from "./views/ResetPassword";
import EmailValidation from "./views/EmailValidation";
import withAuth from "./helpers/withAuth";
import DashboardLayout from "./layouts/Dashboard";
import Search from "./views/Search";
import ProductDetail from "./views/ProductDetail";
import ConfirmModal from "./components/Modals/ConfirmModal";

class App extends React.Component {

    render() {
        return (
            <>
                <ToastContainer/>
                <ConfirmModal/>
                <BrowserRouter>
                    <Switch>
                        <Route path="/" exact component={anyAuth(Landing)}/>
                        <Route path="/login" component={withoutAuth(Login)}/>
                        <Route path="/register" component={withoutAuth(Register)}/>,
                        <Route path="/reset-password/:resetPasswordToken" component={withoutAuth(ResetPassword)}/>
                        <Route path="/email-validation/:userId" component={anyAuth(EmailValidation)}/>
                        <Route path="/dashboard" component={withAuth(DashboardLayout)}/>
                        <Route path="/search" component={anyAuth(Search)}/>
                        <Route path="/ad/:productId" component={anyAuth(ProductDetail)}/>
                        <Redirect to="/"/>
                    </Switch>
                </BrowserRouter>
            </>
        );
    }
}

export default App;
