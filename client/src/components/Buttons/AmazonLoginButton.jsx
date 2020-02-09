import React from "react";
import AnimatedCheck from "../AnimatedCheck";
import constants from "../../helpers/constants";
import SocialButton from "./SocialButton";
import Loading from "../Loading";
import userServices from "../../services/user.services";
import {toast} from "react-toastify";
import PropTypes from "prop-types";

class AmazonLoginButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            amazonId: ''
        };
        this.onAmazonLogin = this.onAmazonLogin.bind(this);
        this.onAmazonFailure = this.onAmazonFailure.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onAmazonLogout = this.onAmazonLogout.bind(this);
    }

    componentDidMount() {
        const amazonId = userServices.getAmazonId();
        if (amazonId) {
            this.setState({amazonId});
        }
    }

    onAmazonLogin(response) {
        userServices.amazonLogin(response.token.accessToken).then(data => {
            const user = data.user;
            this.setState({
                amazonId: user.amazonId,
                loading: false
            });
            if (this.props.onLogin) {
                this.props.onLogin();
            }
        }).catch(() => {
            toast.error("La connection à Amazon a échouée");
            this.setState({loading: false});
        });
    }

    onAmazonFailure(err) {
        this.setState({loading: false});
    }

    onStart() {
        this.setState({loading: true});
    }

    onAmazonLogout() {
        userServices.update(userServices.getCurrentUserId(), {amazonId: null}).then(() => {
            userServices.amazonId = undefined;
            this.setState({
                amazonId: '',
                loading: false
            });
            toast.success('Compte Amazon déconnecté');
        });
    }

    render() {

        const {...props} = this.props;
        props.onLoginSuccess = this.onAmazonLogin;
        props.onLoginFailure = this.onAmazonFailure;
        return (
            <>
                <SocialButton
                    provider='amazon'
                    appId={constants.AMAZON_APP_ID}
                    onLoginSuccess={this.onAmazonLogin}
                    onLoginFailure={this.onAmazonFailure}
                    onLogoutSuccess={this.onAmazonLogout}
                    onLogoutClick={this.onAmazonLogout}
                    onStart={this.onStart}
                    className={"btn " + (this.state.amazonId ? 'btn-default' : 'btn-primary')}
                    linked={this.state.amazonId ? 1 : 0}
                >
                    <Loading loading={this.state.loading} />
                    {this.state.amazonId ? (
                    <>
                        <AnimatedCheck className={"m-0 d-inline-block"} style={{"width": "20px"}}/>
                        <span className="ml-2">Compte Amazon Lié</span>
                    </>
                    ) : (
                    <>
                        <i className="fab fa-amazon size-lg text-yellow"/>
                        <span className="btn-inner--text">Lier un compte Amazon</span>
                    </>
                    )}
                </SocialButton>
            </>
        );
    }
}

AmazonLoginButton.propTypes = {
    onLogin: PropTypes.func
};

export default AmazonLoginButton;
