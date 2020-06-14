import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
// reactstrap components
import {Container} from "reactstrap";
// core components
import SimpleFooter from "./../components/Footers/SimpleFooter.jsx";

import routes from "./../routes.js";
import Sidebar from "../components/Sidebar/Sidebar";
import userServices from "../services/user.services";
import Loading from "../components/Loading";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            routes: []
        };
        this._isMounted = false;
    }

    componentDidMount(e) {
        this._isMounted = true;
        this._isMounted && this.setState({
            routes: routes.filter(route => !route.role || userServices.hasRole(route.role))
        });
        userServices.currentUserSubject.subscribe(() => {
            this._isMounted && this.setState({
                routes: routes.filter(route => !route.role || userServices.hasRole(route.role))
            });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getRoutes = routes => {
        const currentUser = userServices.currentUser;
        return routes.map((route, key) => {
            if (route.layout === "/dashboard" && currentUser && currentUser.roles.includes(route.role)) {
                return (
                    <Route
                        path={route.layout + route.path}
                        component={route.component}
                        key={key}
                    />
                );
            } else {
                return null;
            }
        });
    };

    render() {
        if (!this.state.routes.length) return <Loading/>;
        return (
            <>
                <Sidebar
                    {...this.props}
                    routes={this.state.routes}
                />
                <div className="main-content" ref="mainContent">
                    <Switch>
                        {this.getRoutes(routes)}
                        <Redirect to="/not-found"/>
                    </Switch>
                    <Container fluid>
                        <SimpleFooter/>
                    </Container>
                </div>
            </>
        );
    }
}

export default Dashboard;
