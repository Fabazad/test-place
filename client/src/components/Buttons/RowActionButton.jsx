import PropTypes from "prop-types";
import {Badge, Button, UncontrolledTooltip} from "reactstrap";
import {Link} from "react-router-dom";
import React, {useState} from "react";

const RowActionButton = props => {

    const {title, icon, color, onClick} = props;

    const [tooltipId,] = useState(Math.ceil(Math.random() * 10000));

    const handleClick = e => {
        e.preventDefault();
        onClick();
    };

    return (
        <>
            <Button color={color} className="d-block d-lg-none w-100 text-center mx-0 my-1" onClick={handleClick}>
                <i className={"m-auto fa-lg " + icon}/>
                <span className="ml-2">{title}</span>
            </Button>
            <div className="cursor-pointer avatar avatar-sm bg-transparent d-none d-lg-inline-block">
                <Badge pill className="badge-circle w-100 h-100" color={color} id={"show-" + tooltipId} tag={Link}
                       to={''} onClick={handleClick}>
                    <i className={"m-auto fa-lg " + icon}/>
                </Badge>
                <UncontrolledTooltip delay={0} target={"show-" + tooltipId}>{title}</UncontrolledTooltip>
            </div>
        </>
    );

};

RowActionButton.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

export default RowActionButton;