import React from 'react';
import {Badge, Button, UncontrolledTooltip} from "reactstrap";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

const ShowTestRequestButton = (props) => {
    const {testId} = props;

    const onClick = e => {
        e.preventDefault();
        props.onClick();
    };

    return (
        <>
            <Button color="info" className="d-block d-lg-none w-100 text-center mx-0 my-1" onClick={onClick}>
                <i className="fa fa-eye m-auto fa-lg"/>
                <span className="ml-2">Voir</span>
            </Button>
            <div className="cursor-pointer avatar avatar-sm bg-transparent d-none d-lg-inline-block">
                <Badge pill className="badge-circle w-100 h-100" color={'info'} id={"show-" + testId} tag={Link}
                       to={''} onClick={onClick}>
                    <i className="fa fa-eye m-auto fa-lg"/>
                </Badge>
                <UncontrolledTooltip delay={0} target={"show-" + testId}>Voir</UncontrolledTooltip>
            </div>
        </>
    );
};

ShowTestRequestButton.propTypes = {
    testId: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

export default ShowTestRequestButton;