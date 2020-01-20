import React from "react";
// reactstrap components
import { Badge, UncontrolledTooltip } from "reactstrap";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

class SeeProductButton extends React.Component {

    render() {
        const productId = this.props.productId;
        return (
            <>
                <Badge pill className="badge-circle w-100 h-100" color={'info'}
                       tag={Link} to={'/ad/' + productId} id={"see" + productId}>
                    <i className="fa fa-eye m-auto fa-lg"/>
                </Badge>
                <UncontrolledTooltip delay={0} target={"see" + productId}>Voir</UncontrolledTooltip>
            </>
        );
    }
}

SeeProductButton.propTypes = {
    productId: PropTypes.string.isRequired
};

export default SeeProductButton;