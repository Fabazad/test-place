import React, { Component } from 'react';
import DemoNavbar from 'components/Navbars/DemoNavbar';
import userService from 'services/user.services';
import { eraseCookie, getCookie } from './cookies';
import Loading from 'components/Loading';

export default function withAuth(ComponentToProtect) {

  return class extends Component {

    constructor(props) {
      super(props);
      this.state = {
        loadingPromise: null,
        checked: false
      };
    }
  
    componentDidMount() {
      if (!getCookie("token")) {
        userService.logout();
        this.setState({ checked: true });
      }
      else {
        const loadingPromise = userService.checkToken()
        .then(() => this.setState({ checked: true }));
        this.setState({ loadingPromise });
      }
    }


    render() {
      if(!userService.isAlreadyChecked() && !this.state.checked) {
        return (<><Loading key={"0"} loading={true}/></>);
      }
      return (
        <React.Fragment>
          <div id="login">
            <Loading key={"1"} promise={this.state.loadingPromise} loading={false}/>
            <DemoNavbar {...this.props}/>
            <ComponentToProtect {...this.props} />
          </div>
        </React.Fragment>
      );
    }
  }
}