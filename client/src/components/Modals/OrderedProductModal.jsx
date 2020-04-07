import PropTypes from "prop-types";
import {Button, Modal} from "reactstrap";
import React from "react";
import Form from "reactstrap/es/Form";
import Alert from "reactstrap/es/Alert";
import FormGroup from "reactstrap/es/FormGroup";
import InputGroup from "reactstrap/es/InputGroup";
import ReactDatetime from "react-datetime";
import InputGroupAddon from "reactstrap/es/InputGroupAddon";
import InputGroupText from "reactstrap/es/InputGroupText";
import {getProductAmazonUrl} from "../../helpers/urlHelpers";
import Label from "reactstrap/es/Label";

const OrderedProductModal = props => {
    const {isOpen, onToggle, test} = props;

    if (!test) return null;

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle}>
            <div className="modal-header">
                <h2 className="modal-title">Produit commandé</h2>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={onToggle}>
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body text-center pb-0">
                <Alert className="alert-info">
                    Vous êtes sur le point de confirmer que vous avez bien commandé le produit sur le site Amazon.
                </Alert>
                <div className="mt-3 mb-0">
                    Si ce n'est pas le cas,<br/>
                    Veuillez d'abord commander le produit.
                </div>
                <div className="mt-3">
                    <a href={getProductAmazonUrl(test.product.asin)}>
                        <Button color="default">
                            <i className="fab fa-amazon mr-3"/>
                            Accèder au Produit Amazon
                        </Button>
                    </a>
                </div>

                <Form className="mt-4 px-0 px-md-5 mx-0 mx-md-4">
                    <Label>Date de livraison estimée</Label>
                    <FormGroup>
                        <InputGroup className="input-group-alternative">
                            <ReactDatetime
                                inputProps={{
                                    placeholder: "Date de livraison estimée"
                                }}
                                input={false}
                                timeFormat={false}
                            />
                        </InputGroup>
                    </FormGroup>
                </Form>
            </div>
            <div className="modal-footer">
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
                    Fermer
                </Button>
            </div>
        </Modal>
    )

};

OrderedProductModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    test: PropTypes.object.isRequired
};

export default OrderedProductModal;