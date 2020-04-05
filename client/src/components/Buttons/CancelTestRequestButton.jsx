import React from "react";
// reactstrap components
import PropTypes from "prop-types";
import CancelTestRequestModal from "../Modals/CancelTestRequestModal";
import RowActionButtons from "./RowActionButton";

class CancelTestRequestButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        const testId = this.props.testId;
        return (
            <>
                <RowActionButtons title="Annuler" icon="fa-times" color="danger" onClick={this.toggleModal}/>
                <CancelTestRequestModal isOpen={this.state.isOpen} onClose={this.toggleModal} testId={testId}/>
            </>
        );
    }
}

CancelTestRequestButton.propTypes = {
    testId: PropTypes.string.isRequired
};

export default CancelTestRequestButton;