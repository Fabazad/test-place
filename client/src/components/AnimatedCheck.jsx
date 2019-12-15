import React from "react";
import '../assets/scss/animated-checks.scss';
import PropTypes from "prop-types";

class AnimatedCheck extends React.Component {

    render() {
        const style = this.props.style || {};
        const className = this.props.className || "";
        return (
        <>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2" style={style} className={className}>
                <circle className="path circle" fill="none" stroke="#73AF55" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                <polyline className="path check" fill="none" stroke="#73AF55" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
            </svg>
        </>
        );
    }
}

AnimatedCheck.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string
};

export default AnimatedCheck;
