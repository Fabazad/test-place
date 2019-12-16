import React from "react";
import SocialLogin from 'react-social-login'
import { Button } from "reactstrap";
import PropTypes from "prop-types";
import AnimatedCheck from "./AnimatedCheck";

class AmazonLoginButton extends React.Component {

    constructor(props) {
        super(props);
        this.onButtonClicked = this.onButtonClicked.bind(this);
    }

    onButtonClicked() {
        if(this.props.linked) {
            this.props.onStartLogout();
            this.props.triggerLogout();
        } else {
            this.props.onStartLogin();
            this.props.triggerLogin();
        }
    }
    
    render() {
        const { triggerLogin, triggerLogout, onStartLogin, onStartLogout, linked, ...props } = this.props;
        return (
            <Button onClick={this.onButtonClicked} {...props}>
                {
                    this.props.linked ? (
                        <>
                            <AnimatedCheck className={"m-0 d-inline-block"} style={{"width": "20px"}}/>
                            <span className="ml-2">Compte Amazon Lié</span>
                        </>
                    ) : (
                        <>
                            <i className="fa fa-amazon size-lg text-yellow"/>
                            <span className="btn-inner--text">Lier un compte Amazon</span>
                        </>
                    )
                }

            </Button>
        );
    }
}

AmazonLoginButton.propTypes = {
    linked: PropTypes.bool.isRequired,
    triggerLogin: PropTypes.func,
    triggerLogout: PropTypes.func,
    onStartLogin: PropTypes.func,
    onStartLogout: PropTypes.func
};

export default SocialLogin(AmazonLoginButton);
