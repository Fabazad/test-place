import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk'

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss";
import "assets/scss/style.scss";

import Login from "views/Login";
import Register from "views/Register";
import Landing from "views/Landing";
import Profile from "views/Profile";
import "interceptors";
import withAuth from "helpers/withAuth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)));

ReactDOM.render(
  <Provider store={store}>
  <ToastContainer />
    <BrowserRouter>
      <Switch>
        <Route path="/" exact render={props => <Login {...props} />} />
        <Route path="/login" exact render={props => <Login {...props} />} />
        <Route path="/register" exact render={props => <Register {...props} />} />
        <Route path="/landing" exact render={props => <Landing {...props} />} />
        <Route path="/profile" component={withAuth(Profile)} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);