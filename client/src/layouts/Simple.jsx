import React from "react";
import { Route, Switch } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";

import routes from "routes.js";

class Simple extends React.Component {
  
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }

  getRoutes = routes => {
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
  
  render() {
    return (
      <>
        <div>
          <Switch>{this.getRoutes(routes)}</Switch>
          <Container fluid>
            <SimpleFooter />
          </Container>
        </div>
      </>
    );
  }
}

export default Simple;
