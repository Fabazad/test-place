import PropTypes from "prop-types";
import Label from "reactstrap/lib/Label";
import Alert from "reactstrap/es/Alert";
import React from "react";

const NextStepAdvice = props => {

    const {color, children} = props;

    return (
        <div className="text-left w-100">
            <Label>Ensuite ?</Label>
            <Alert color={color ? color : 'info'}>
                {children}
            </Alert>
        </div>
    );
};

NextStepAdvice.propTypes = {
    color: PropTypes.string.isRequired
};

export default NextStepAdvice;