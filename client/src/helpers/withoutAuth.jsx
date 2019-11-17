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
        loading: true,
        redirect: false,
      };
    }
    componentDidMount() {
      if (getCookie("token")) {
        this.setState({ loading: false, redirect: true });
      }
      else {
        userServices.logout();
        this.setState({ loading: false });
      }
    }
    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
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