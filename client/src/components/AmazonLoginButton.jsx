import React from "react";
import SocialLogin from 'react-social-login'
import { Button } from "reactstrap";
import PropTypes from "prop-types";

class AmazonLoginButton extends React.Component {
    render() {
        const { triggerLogin, ...props } = this.props;
        return (
            <Button onClick={triggerLogin} {...props} >
                { this.props.children }
            </Button>
        );
    }
}

AmazonLoginButton.propTypes = {
    triggerLogin: PropTypes.func.isRequired
};

export default SocialLogin(AmazonLoginButton);
