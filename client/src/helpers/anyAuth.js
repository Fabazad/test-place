import React, { Component } from 'react';
import DemoNavbar from 'components/Navbars/DemoNavbar';
import userService from 'services/user.services';
import { eraseCookie, getCookie } from './cookies';

export default function withAuth(ComponentToProtect) {

  return class extends Component {

    constructor() {
      super();
      this.state = {
        loading: true,
      };
    }
  
    componentDidMount() {
      if (!getCookie("token")) {
        userService.logout();
        this.setState({ loading: false });
      }
      else {
        userService.checkToken()
        .then( () =>  this.setState({ loading: false }))
        .catch(err => {
          this.setState({ loading: false });
          eraseCookie("token");
        });
      }
    }


    render() {
      const { loading } = this.state;
      if (loading) {
        return null;
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