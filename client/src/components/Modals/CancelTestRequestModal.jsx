import React from "react";
// reactstrap components
import {
    Button,
    Modal,
    Form,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input
} from "reactstrap";
import {withTranslation} from "react-i18next";
import Loading from "../Loading";
import PropTypes from "prop-types";
import EditProductModal from "./EditProductModal";

//import PropTypes from 'prop-types';

class CancelTestRequestModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cancelReason: '',
            loadingPromise: null
        };
    }

    handleInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.props.onClose();
    };

    render() {
        const {onClose, isOpen} = this.props;
        return (
            <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onClose}>
                <Loading promise={this.state.loadingPromise}/>
                <Form role="form" onSubmit={this.onSubmit}>
                    <div className="modal-header bg-secondary">
                        <h4 className="modal-title" id="exampleModalLabel">
                            Annuler la Demande de Test
                        </h4>
                        <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                onClick={onClose}>
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body white-space-pre-line bg-secondary">
                        <FormGroup className="mb-3">
                            <Input placeholder={"Expliquez pourquoi vous désirez annuler la demande de test..."}
                                   type="textarea" className="form-control-alternative" name="cancelReason" rows={5}
                                   value={this.state.cancelReason} onChange={this.handleInputChange} required/>
                        </FormGroup>
                    </div>
                    <div className="modal-footer bg-secondary ">
                        <Button color="secondary" data-dismiss="modal" type="button" onClick={onClose}>
                            Fermer
                        </Button>
                        <Button color="danger" data-dismiss="modal" type="submit">
                            Annuler
                        </Button>
                    </div>
                </Form>
            </Modal>
        );
    }
}

CancelTestRequestModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
};

export default withTranslation()(CancelTestRequestModal);