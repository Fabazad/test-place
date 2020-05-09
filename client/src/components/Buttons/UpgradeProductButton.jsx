import React from "react";
// reactstrap components
import PropTypes from "prop-types";
import RowActionButton from "./RowActionButton";

class UpgradeProductButton extends React.Component {

    render() {
        const productId = this.props.productId;
        return (
            <>
                <RowActionButton title="Upgrade" icon="far fa-gem" color="primary"
                                 onClick={() => console.log("upgrade")}/>
            </>
        );
    }
}

UpgradeProductButton.propTypes = {
    productId: PropTypes.string.isRequired
};

export default UpgradeProductButton;