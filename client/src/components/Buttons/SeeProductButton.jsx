import React from "react";
// reactstrap components
import {Badge, Button, UncontrolledTooltip} from "reactstrap";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

class SeeProductButton extends React.Component {

    render() {
        const productId = this.props.productId;
        return (
            <>
                <Button color="info" className="d-block d-lg-none w-100 text-center mx-0 my-1" tag={Link}
                        to={'/ad/' + productId}>
                    <i className="fa fa-eye m-auto fa-lg"/>
                    <span className="ml-2">Voir</span>
                </Button>
                <div className="cursor-pointer avatar avatar-sm bg-transparent d-none d-lg-inline-block">
                    <Badge pill className="badge-circle w-100 h-100" color={'info'}
                           tag={Link} to={'/ad/' + productId} id={"see" + productId}>
                        <i className="fa fa-eye m-auto fa-lg"/>
                    </Badge>
                    <UncontrolledTooltip delay={0} target={"see" + productId}>Voir</UncontrolledTooltip>
                </div>
            </>
        );
    }
}

SeeProductButton.propTypes = {
    productId: PropTypes.string.isRequired
};

export default SeeProductButton;