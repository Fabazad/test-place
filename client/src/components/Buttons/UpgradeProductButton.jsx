import React from "react";
// reactstrap components
import {Badge, Button, UncontrolledTooltip} from "reactstrap";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

class UpgradeProductButton extends React.Component {

    render() {
        const productId = this.props.productId;
        return (
            <>
                <Button color="primary" className="d-block d-lg-none w-100 text-center mx-0 my-1">
                    <i className="far fa-gem m-auto fa-lg"/>
                    <span className="ml-2">Upgrade</span>
                </Button>
                <div className="cursor-pointer avatar avatar-sm bg-transparent d-none d-lg-inline-block">
                    <Badge pill className="badge-circle w-100 h-100" color={'primary'}
                           tag={Link} to={'#'} id={"upgrade" + productId}>
                        <i className="far fa-gem m-auto fa-lg"/>
                    </Badge>
                    <UncontrolledTooltip delay={0} target={"upgrade" + productId}>Upgrade</UncontrolledTooltip>
                </div>
            </>
        );
    }
}

UpgradeProductButton.propTypes = {
    productId: PropTypes.string.isRequired
};

export default UpgradeProductButton;