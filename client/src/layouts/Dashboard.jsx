import React, {useEffect, useState} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
// reactstrap components
import {Container} from "reactstrap";
// core components
import SimpleFooter from "./../components/Footers/SimpleFooter.jsx";

import routes from "./../routes.js";
import Sidebar from "../components/Sidebar/Sidebar";
import userServices from "../services/user.services";
import Loading from "../components/Loading";
import {withTranslation} from "react-i18next";

const Dashboard = ({t, location, bgColor, logo}) => {

    const [dashboardRoutes, setDashboardRoutes] = useState([])

    useEffect(() => {
        setDashboardRoutes(routes(t).filter(route => !route.role || userServices.hasRole(route.role)))

        userServices.currentUserSubject.subscribe(() => {
            setDashboardRoutes(routes(t).filter(route => !route.role || userServices.hasRole(route.role)))
        });
    }, [t])

    const getRoutes = (routes) => {
        return routes.map((route, key) => {
            if (route.layout === "/dashboard") {
                const component = (!route.role || userServices.hasRole(route.role)) ?
                    route.component : () => (<Redirect to="/login"/>);
                return (
                    <Route
                        path={route.layout + route.path}
                        component={component}
                        key={key}
                    />
                );
            } else {
                return null;
            }
        });
    };

    if (!dashboardRoutes.length) return <Loading/>;
    return (
        <>
            <Sidebar
                location={location}
                bgColor={bgColor} logo={logo}
                routes={dashboardRoutes}
            />
            <div className="main-content">
                <Switch>
                    {getRoutes(dashboardRoutes)}
                    <Redirect to="/not-found"/>
                </Switch>
                <Container fluid>
                    <SimpleFooter/>
                </Container>
            </div>
        </>
    );
}

export default withTranslation()(Dashboard);
