import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import DemoNavbar from 'components/Navbars/DemoNavbar';
import { getCookie } from './cookies';
import userServices from 'services/user.services';

export default function withoutAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        redirect: false,
      };
    }
    componentDidMount() {
      if (getCookie("token")) {
        this.setState({ redirect: true });
      }
      else {
        console.log("3");
        userServices.logout();
      }
    }
    render() {
      const { redirect } = this.state;
      if (redirect) {
        return <Redirect to="/landing" />;
      }
      return (
        <React.Fragment>
            <DemoNavbar {...this.props} />
          <ComponentToProtect {...this.props} />
        </React.Fragment>
      );
    }
  }
}