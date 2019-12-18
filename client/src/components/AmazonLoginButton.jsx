import React from "react";
import AnimatedCheck from "./AnimatedCheck";
import constants from "../helpers/constants";
import SocialButton from "./SocialButton";
import Loading from "./Loading";

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

    onAmazonLogin(response) {
        console.log(response);
        this.setState({
            amazonId: response._profile.id,
            loading: false
        });
    }

    onAmazonFailure(err) {
        this.setState({loading: false});
    }

    onStart() {
        this.setState({loading: true});
    }

    onAmazonLogout() {
        this.setState({
            amazonId: '',
            loading: false
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
                    onStart={this.onStart}
                    className={"btn btn-default"}
                    linked={this.state.amazonId ? 1 : 0}
                >
                    <Loading loading={this.state.loading} />
                    {this.state.amazonId ? (
                    <>
                        <i className="fa fa-amazon size-lg text-yellow"/>
                        <AnimatedCheck className={"m-0 d-inline-block"} style={{"width": "20px"}}/>
                        <span className="ml-2">Compte Amazon Lié</span>
                    </>
                    ) : (
                    <>
                        <i className="fa fa-amazon size-lg text-yellow"/>
                        <span className="btn-inner--text">Lier un compte Amazon</span>
                    </>
                    )}
                </SocialButton>
            </>
        );
    }
}

AmazonLoginButton.propTypes = {
};

export default AmazonLoginButton;
