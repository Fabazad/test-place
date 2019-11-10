import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import userService from 'services/user.services';

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
      userService.checkToken()
        .then( () =>  this.setState({ loading: false, redirect: true }))
        .catch(err => {
          
          this.setState({ loading: false });
        });
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
          <ComponentToProtect {...this.props} />
        </React.Fragment>
      );
    }
  }
}