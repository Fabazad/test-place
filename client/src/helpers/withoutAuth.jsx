import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import DemoNavbar from '../components/Navbars/DemoNavbar';
import {getCookie} from './cookies';
import userServices from '../services/user.services';

export default function withoutAuth(ComponentToProtect) {
    return class extends Component {

        constructor(props) {
            super(props);
            this.state = {
                redirect: false,
            };
            this._mount = false;
        }

        componentDidMount() {
          this._mount = true;
            if (getCookie("token")) {
                this.setState({redirect: true});
            } else {
                userServices.logout();
            }
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            if (getCookie("token")) {
                this.setState({redirect: true});
            } else {
                userServices.logout();
            }
        }

        componentWillUnmount() {
          this._mount = false;
        }

      render() {
            const {redirect} = this.state;
            if (redirect) {
                return <Redirect to="/"/>;
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