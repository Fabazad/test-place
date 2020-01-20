import React from "react";
// reactstrap components
import { Badge, UncontrolledTooltip } from "reactstrap";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

class EditProductButton extends React.Component {

    render() {
        const productId = this.props.productId;
        return (
            <>
                <Badge pill
                       className="badge-circle w-100 h-100" color={'warning'}
                       tag={Link} to={'#'} id={"edit" + productId}>
                    <i className="fa fa-edit m-auto fa-lg"/>
                </Badge>
                <UncontrolledTooltip delay={0} target={"edit" + productId}>Editer</UncontrolledTooltip>
            </>
        );
    }
}

EditProductButton.propTypes = {
    productId: PropTypes.string.isRequired
};

export default EditProductButton;