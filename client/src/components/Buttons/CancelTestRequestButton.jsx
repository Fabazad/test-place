import React from "react";
// reactstrap components
import {Badge, Button, UncontrolledTooltip} from "reactstrap";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import CancelTestRequestModal from "../Modals/CancelTestRequestModal";

class CancelTestRequestButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal(e) {
        e.preventDefault();
        this.setState({isOpen: true});
    }

    closeModal() {
        this.setState({isOpen: false});
    }

    render() {
        const testId = this.props.testId;
        return (
            <>
                <Button color="danger" className="d-block d-lg-none w-100 text-center mx-0 my-1"
                        onClick={this.openModal}>
                    <i className="fa fa-times m-auto fa-lg"/>
                    <span className="ml-2">Annuler</span>
                </Button>
                <div className="cursor-pointer avatar avatar-sm bg-transparent d-none d-lg-inline-block">
                    <Badge pill className="badge-circle w-100 h-100" color={'danger'} id={"cancel-" + testId} tag={Link}
                           to={''} onClick={this.openModal}>
                        <i className="fa fa-times m-auto fa-lg"/>
                    </Badge>
                    <UncontrolledTooltip delay={0} target={"cancel-" + testId}>Annuler</UncontrolledTooltip>
                </div>
                <CancelTestRequestModal isOpen={this.state.isOpen} onClose={this.closeModal} testId={testId}/>
            </>
        );
    }
}

CancelTestRequestButton.propTypes = {
    testId: PropTypes.string.isRequired
};

export default CancelTestRequestButton;