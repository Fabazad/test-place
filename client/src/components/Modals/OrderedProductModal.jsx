import PropTypes from "prop-types";
import {Button, Modal} from "reactstrap";
import React, {useState} from "react";
import Form from "reactstrap/es/Form";
import Alert from "reactstrap/es/Alert";
import FormGroup from "reactstrap/es/FormGroup";
import InputGroup from "reactstrap/es/InputGroup";
import ReactDatetime from "react-datetime";
import {getProductAmazonUrl} from "../../helpers/urlHelpers";
import Label from "reactstrap/es/Label";
import testServices from "../../services/test.services";
import {toast} from "react-toastify";

const OrderedProductModal = props => {
    const {isOpen, onToggle, test} = props;

    const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(null);

    if (!test) return null;

    const handleConfirm = async () => {
        const statuses = await testServices.getTestStatuses();
        testServices.updateStatus(test._id, statuses['productOrdered'],
            {estimatedDeliveryDate: estimatedDeliveryDate.toDate()})
            .then(() => {
                testServices.testsSubject.next();
                onToggle();
                toast.success("Produit enregistré comme commandé.")
            })
    };

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

                <Form className="mt-4 px-0 px-md-5 mx-0 mx-md-4 bg-secondary rounded py-3 shadow">
                    <Label><h3>Date de livraison estimée</h3></Label>
                    <FormGroup>
                        <InputGroup className="input-group-alternative">
                            <ReactDatetime
                                inputProps={{placeholder: "Date de livraison estimée"}} input={false}
                                timeFormat={false} onChange={date => setEstimatedDeliveryDate(date)}
                            />
                        </InputGroup>
                    </FormGroup>
                </Form>
            </div>
            <div className="modal-footer">
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
                    Fermer
                </Button>
                <Button color="primary" disabled={!estimatedDeliveryDate} onClick={handleConfirm}>Confirmer</Button>
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