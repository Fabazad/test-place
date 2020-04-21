import React from "react";
import AnimatedCheck from "../AnimatedCheck";
import constants from "../../helpers/constants";
import SocialButton from "./SocialButton";
import Loading from "../Loading";
import userServices from "../../services/user.services";
import {toast} from "react-toastify";
import PropTypes from "prop-types";
import AmazonLoginModal from "../Modals/AmazonLoginModal";

class AmazonLoginButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            amazonId: '',
            isOpen: false
        };
        this.onAmazonLogin = this.onAmazonLogin.bind(this);
        this.onAmazonFailure = this.onAmazonFailure.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onAmazonLogout = this.onAmazonLogout.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
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
        this.setState({loading: true});
        userServices.amazonLogout(userServices.getCurrentUserId())
            .then(() => {
                userServices.currentUser.amazonId = null;
                this.setState({
                    amazonId: '',
                    loading: false
                });
                toast.success('Compte Amazon déconnecté');
            })
            .catch(() => this.setState({ loading: false }));
    }

    getButtonColor(type, linked) {
        if (type === "login" && linked) return "default";
        if (type === "login" && !linked) return "primary";
        if (type === "switch") return "primary";
        if (type === "logout") return "danger";
    }

    toggleModal() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {

        const {...props} = this.props;
        props.onLoginSuccess = this.onAmazonLogin;
        props.onLoginFailure = this.onAmazonFailure;
        const type = this.props.type ?? 'login';
        const linked = !!this.state.amazonId;

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
                    className={"btn btn-" + this.getButtonColor(type, linked)}
                    linked={linked}
                    type={type}
                    onOpenModalClick={this.toggleModal}
                >
                    <Loading loading={this.state.loading}/>
                    {type === "login" && linked ? (
                        <>
                            <AnimatedCheck className={"m-0 d-inline-block"} style={{"width": "20px"}}/>
                            <span className="ml-2">Compte Amazon Lié</span>
                        </>
                    ) : null }
                    {type === "login" && !linked ? (
                        <>
                            <i className="fab fa-amazon size-lg text-yellow"/>
                            <span className="btn-inner--text">Lier un compte Amazon</span>
                        </>
                    ) : null}
                    {type === "switch" ? (
                        <>
                            <i className="fab fa-amazon size-lg text-yellow"/>
                            <span className="btn-inner--text">Lier un autre compte Amazon</span>
                        </>
                    ) : null}
                    {type === "logout" ? (
                        <>
                            <i className="fab fa-amazon size-lg text-yellow"/>
                            <span className="btn-inner--text">Retirer le compte Amazon</span>
                        </>
                    ) : null}
                </SocialButton>
                <AmazonLoginModal toggleModal={this.toggleModal} isOpen={this.state.isOpen} amazonId={this.state.amazonId}/>
            </>
        );
    }
}

AmazonLoginButton.propTypes = {
    onLogin: PropTypes.func,
    type: PropTypes.string
};

export default AmazonLoginButton;
