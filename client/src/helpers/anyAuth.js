import React, {Component} from 'react';
import DemoNavbar from '../components/Navbars/DemoNavbar';
import userService from '../services/user.services';
import {getCookie} from './cookies';
import Loading from '../components/Loading';

export default function withAuth(ComponentToProtect) {

    return class extends Component {
      _mount;

        constructor(props) {
            super(props);
            this.state = {
                loadingPromise: null,
                checked: false
            };

            this._mount = false;
        }

        componentDidMount() {
            this._mount = true;
            if (!getCookie("token")) {
                userService.logout();
                this.setState({checked: true});
            } else {
                const loadingPromise = userService.checkToken()
                    .then(() => this._mount && this.setState({checked: true}));
                this.setState({loadingPromise});
            }
        }

        componentWillUnmount() {
            this._mount = false;
        }


        render() {
            if (!userService.isAlreadyChecked() && !this.state.checked) {
                return (<><Loading key={"0"} loading={true}/></>);
            }
            return (
                <React.Fragment>
                    <div id="login">
                        <Loading promise={this.state.loadingPromise} loading={false}/>
                        <DemoNavbar {...this.props}/>
                        <ComponentToProtect {...this.props} />
                    </div>
                </React.Fragment>
            );
        }
    }
}