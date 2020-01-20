import React from "react";
// reactstrap components
import { Badge, UncontrolledTooltip } from "reactstrap";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

class UpgradeProductButton extends React.Component {

    render() {
        const productId = this.props.productId;
        return (
            <>
                <Badge pill className="badge-circle w-100 h-100" color={'primary'}
                       tag={Link} to={'#'} id={"upgrade" + productId}>
                    <i className="fa fa-diamond m-auto fa-lg"/>
                </Badge>
                <UncontrolledTooltip delay={0} target={"upgrade" + productId}>Upgrade</UncontrolledTooltip>
            </>
        );
    }
}

UpgradeProductButton.propTypes = {
    productId: PropTypes.string.isRequired
};

export default UpgradeProductButton;