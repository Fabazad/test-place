import React from 'react'
import SocialLogin from 'react-social-login'
import PropTypes from 'prop-types';

class SocialButton extends React.Component {

    onClick() {
        if (this.props.type === 'login' && !this.props.linked) {
            this.props.onStart();
            this.props.triggerLogout();
            this.props.triggerLogin();
        }
        if (this.props.type === 'login' && this.props.linked) {
            this.props.onOpenModalClick();
        }
        if (this.props.type === 'logout') {
            this.props.onStart();
            this.props.triggerLogout();
            this.props.onLogoutClick();
        }
        if (this.props.type === 'switch') {
        }
    }

    render() {
        const {triggerLogin, onStart, triggerLogout, ...props} = this.props;
        return (
            <button onClick={() => this.onClick()} {...props}>
                {this.props.children}
            </button>
        );
    }
}

SocialButton.propTypes = {
    onStart: PropTypes.func,
    triggerLogin: PropTypes.func,
    triggerLogout: PropTypes.func,
    onLogoutSuccess: PropTypes.func,
    onLogoutClick: PropTypes.func,
    linked: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    onOpenModalClick: PropTypes.func.isRequired
};

export default SocialLogin(SocialButton);