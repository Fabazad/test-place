import React, {useEffect} from "react";
import {Route, Switch} from "react-router-dom";
// reactstrap components
import {Container} from "reactstrap";
// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";

import routes from "routes.js";
import {withTranslation} from "react-i18next";

const Simple = ({t}) => {

    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    })

    const getRoutes = routes => {
        return routes.map((prop, key) => {
            if (prop.layout === "/dashboard") {
                return (
                    <Route
                        path={prop.layout + prop.path}
                        component={prop.component}
                        key={key}
                    />
                );
            } else {
                return null;
            }
        });
    };

    return (
        <>
            <div>
                <Switch>{getRoutes(routes(t))}</Switch>
                <Container fluid>
                    <SimpleFooter/>
                </Container>
            </div>
        </>
    );
}

export default withTranslation()(Simple);
