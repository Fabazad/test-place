import React from "react";
import { withTranslation } from 'react-i18next';
import {ToastContainer} from "react-toastify";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import withoutAuth from "./helpers/withoutAuth";
import Login from "./views/Login";
import Register from "./views/Register";
import anyAuth from "./helpers/anyAuth";
import Landing from "./views/Landing";
import Profile from "./views/Profile";
import ResetPassword from "./views/ResetPassword";
import EmailValidation from "./views/EmailValidation";
import withAuth from "./helpers/withAuth";
import DashboardLayout from "./layouts/Dashboard";
import {Provider} from "react-redux";
import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "./reducers";
import thunkMiddleware from "redux-thunk";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)));

class App extends React.Component {

    render() {
        return (
            <Provider store={store}>
                <ToastContainer/>
                <BrowserRouter>
                    <Switch>
                        <Route path="/" exact render={props => <Redirect to={"/login"}/>}/>
                        <Route path="/login" component={withoutAuth(Login)}/>
                        <Route path="/register" component={withoutAuth(Register)}/>
                        <Route path="/landing" component={anyAuth(Landing)}/>
                        <Route path="/profile/:userId" component={anyAuth(Profile)}/>
                        <Route path="/reset-password/:resetPasswordToken" component={withoutAuth(ResetPassword)}/>
                        <Route path="/email-validation/:userId" component={anyAuth(EmailValidation)}/>
                        <Route path="/dashboard" component={withAuth(DashboardLayout)}/>
                        <Redirect to="/"/>
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default withTranslation()(App);
