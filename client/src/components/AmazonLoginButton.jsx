import React from "react";
import SocialLogin from 'react-social-login'
import { Button } from "reactstrap";
import PropTypes from "prop-types";
import AnimatedCheck from "./AnimatedCheck";

class AmazonLoginButton extends React.Component {

    onButtonClicked() {
        if(this.props.linked) {
            this.props.triggerLogin();
        } else {
            this.props.triggerLogout();
        }
    }
    
    render() {
        const { triggerLogin, linked, ...props } = this.props;
        return (
            <Button onClick={() => this.onButtonClicked()} {...props}>
                {
                    this.props.linked ? (
                        <>
                            <AnimatedCheck className={"m-0 d-inline-block"} style={{"width": "26px"}}/>
                            <span className="ml-2">Compte Amazon Lié</span>
                        </>
                    ) : (
                        <>
                            <i className="fa fa-amazon size-lg text-yellow"/>
                            <span className="btn-inner--text">Lier le compte Amazon</span>
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
    triggerLogout: PropTypes.func
};

export default SocialLogin(AmazonLoginButton);
