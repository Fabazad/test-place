import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import userService from 'services/user.services';
import DemoNavbar from 'components/Navbars/DemoNavbar';
import Loading from 'components/Loading';

export default function withAuth(ComponentToProtect) {
    return class extends Component {

        constructor() {
            super();
            this.state = {
                redirect: false,
                checked: false,
                loadingPromise: null
            };
        }

        componentDidMount() {
            const loadingPromise = userService.checkToken()
                .then((res) => {
                    if (res && res.check) {
                        this.setState({checked: true});
                    } else {
                        this.setState({checked: true, redirect: true});
                        userService.logout();
                    }
                });
            this.setState({loadingPromise});
        }

        render() {
            const {checked, redirect, loadingPromise} = this.state;
            if (redirect) {
                return <Redirect to='/login'/>;
            }
            if (!userService.isAlreadyChecked() && !checked) {
                return (<><Loading key={"0"} loading={true}/></>);
            }
            return (
                <React.Fragment>
                    <Loading key={"1"} promise={loadingPromise}/>
                    <DemoNavbar {...this.props}/>
                    <ComponentToProtect {...this.props} />
                </React.Fragment>
            );
        }
    }
}