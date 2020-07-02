import React from "react";
import '../assets/scss/animated-checks.scss';
import PropTypes from "prop-types";
import {UncontrolledPopover, PopoverBody} from "reactstrap";

const InfoPopover = ({children, className}) => {
    const popoverId = Math.ceil(Math.random() * 10000);

    return (
        <>
            <i className={"fa fa-question-circle cursor-pointer " + className} id={"popover" + popoverId}/>
            <UncontrolledPopover placement="auto" target={"popover" + popoverId} trigger="legacy">
                <PopoverBody className="p-3">
                    {children}
                </PopoverBody>
            </UncontrolledPopover>
        </>
    );
};

InfoPopover.propTypes = {
    className: PropTypes.string
};

export default InfoPopover;
