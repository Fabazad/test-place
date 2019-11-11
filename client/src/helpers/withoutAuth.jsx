import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import DemoNavbar from 'components/Navbars/DemoNavbar';
import { getCookie } from './cookies';

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
        this.setState({ loading: false });
      }
    }
    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/profile" />;
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