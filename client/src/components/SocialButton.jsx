import React from 'react'
import SocialLogin from 'react-social-login'
import PropTypes from 'prop-types';

class SocialButton extends React.Component {

    onClick() {
        this.props.onStart();
        if (this.props.linked) {
            this.props.triggerLogout();
        } else {
            this.props.triggerLogin();
        }
    }

    render() {
        const {triggerLogin, onStart, triggerLogout, ...props} = this.props;
        return (
            <button onClick={() => this.onClick()} {...props}>
                { this.props.children }
            </button>
        );
    }
}

SocialButton.propTypes = {
    onStart: PropTypes.func,
    triggerLogin: PropTypes.func,
    triggerLogout: PropTypes.func,
    linked: PropTypes.number.isRequired
};

export default SocialLogin(SocialButton);