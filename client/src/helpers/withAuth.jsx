import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import userService from 'services/user.services';
import DemoNavbar from 'components/Navbars/DemoNavbar';
import { eraseCookie } from './cookies';

export default function withAuth(ComponentToProtect) {
  return class extends Component {

    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
      };
    }

    componentDidMount() {
      userService.checkToken()
        .then( () =>  this.setState({ loading: false }))
        .catch(err => {
          this.setState({ loading: false, redirect: true });
          eraseCookie("token");
        });
    }

    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/login" />;
      }
      return (
        <React.Fragment>
          <DemoNavbar {...this.props}/>
          <ComponentToProtect {...this.props} />
        </React.Fragment>
      );
    }
  }
}