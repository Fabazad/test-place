import PropTypes from "prop-types";
import {Button, Modal} from "reactstrap";
import React from "react";

const ProcessingTestModal = props => {

    const {isOpen, onToggle, test} = props;

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle}
        >
            <div className="modal-header">
                <h5 className="modal-title">
                    Test en Cours
                </h5>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={onToggle}>
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body white-space-pre-line">Yooo</div>
            <div className="modal-footer">
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
                    Close
                </Button>
            </div>
        </Modal>
    )
};

ProcessingTestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    test: PropTypes.object.isRequired
};

export default ProcessingTestModal;