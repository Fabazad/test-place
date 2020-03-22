import React  from 'react';
import {Button, Modal} from "reactstrap";
import PropTypes from "prop-types";

const TestRequestModal = (props) => {
    const {isOpen, onToggle, test} = props;

    if (!test) return '';

    return (
        <Modal className="modal-dialog-centered" size='lg' isOpen={isOpen} toggle={onToggle}>
            <div className="modal-header">
                <h3 className="modal-title" id="exampleModalLabel">
                    Demande de test
                </h3>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={onToggle}>
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body white-space-pre-line">
                <div className="row">
                    <div className="col-4 text-center">
                        <img src={test.product.imageUrls[0]} alt="" height='150' className='rounded shadow-lg'/>
                    </div>
                    <div className="col-8 d-flex">
                        <h4 className='my-auto'>{test.product.title}</h4>
                    </div>
                </div>

            </div>
            <div className="modal-footer">
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle} >
                    Close
                </Button>
            </div>
        </Modal>
    );
};

TestRequestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    test: PropTypes.object
};

export default TestRequestModal;