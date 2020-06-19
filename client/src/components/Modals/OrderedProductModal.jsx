import PropTypes from "prop-types";
import {Button, Modal} from "reactstrap";
import React, {useEffect, useState} from "react";
import Form from "reactstrap/es/Form";
import Alert from "reactstrap/es/Alert";
import FormGroup from "reactstrap/es/FormGroup";
import {getProductAmazonUrl} from "../../helpers/urlHelpers";
import Label from "reactstrap/es/Label";
import testServices from "../../services/test.services";
import {toast} from "react-toastify";
import Input from "reactstrap/es/Input";
import InfoPopover from "../InfoPopover";
import ImageUploader from "../ImageUploader";
import constants from "../../helpers/constants";
import s3Services from "../../services/s3.services";
import Loading from "../Loading";

const OrderedProductModal = props => {
    const {isOpen, onToggle, testId} = props;

    const [test, setTest] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [orderScreenshotUrl, setOrderScreenshotUrl] = useState(null);
    const [orderScreenshot, setOrderScreenshot] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        testServices.getOne(testId).then(setTest);
    }, [testId]);

    if (!test) return null;

    const handleConfirm = async () => {
        if (!orderScreenshot) {
            toast.error("Veuillez ajouter la capture d'écran de votre commande.");
            return;
        }

        setLoading(true);

        try {
            const statuses = await testServices.getTestStatuses();

            const finalScreenshotUrl = await s3Services.upload(orderScreenshot);

            await testServices.updateStatus(test._id, statuses['productOrdered'], {
                orderId,
                orderScreenshotUrl: finalScreenshotUrl
            });

            testServices.testsSubject.next();
            onToggle();
            toast.success("Produit enregistré comme commandé.");
        } catch (err) {
            console.log(err);
            toast.error(err.toString);
        }

        setLoading(false);
    };

    const retrieveAndSetScreenshotUrl = file => {
        try {
            const fileUrl = URL.createObjectURL(file);
            setOrderScreenshot(file);
            setOrderScreenshotUrl(fileUrl);
        } catch(err) {
            console.log(err);
            toast.error("Impossible d'importer cette image.");
        }

    };

    const disabled = !orderId || !orderId.match(/^\w{3}-\w{7}-\w{7}$/) || !orderScreenshot;

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle}>
            <Loading loading={loading}/>
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
                <div className="text-left w-100">
                    {test.sellerMessage ?
                        <div className="mb-3">
                            <Label>Message du Vendeur - {test.seller.name}</Label>
                            <Alert color="success">
                                {test.sellerMessage}
                            </Alert>
                        </div> : null}
                </div>
                <div className="mt-3 mb-0">
                    Si ce n'est pas le cas,<br/>
                    Veuillez d'abord commander le produit.
                </div>
                <div className="mt-3">
                    <a href={getProductAmazonUrl(test.product.asin, test.product.keywords)}>
                        <Button color="default">
                            <i className="fab fa-amazon mr-3"/>
                            Accèder au Produit Amazon
                        </Button>
                    </a>
                </div>

                <hr/>

                <Form className="mt-4 px-0 px-md-5 mx-0 mx-md-4 bg-secondary rounded py-3 shadow">
                    <FormGroup>
                        <Label>
                            Capture d'écran de la commande
                            <InfoPopover className="ml-3">
                                Prenez une photo de votre commande sur la&nbsp;
                                <a href="https://www.amazon.fr/gp/css/order-history" target="_blank"
                                   rel="noopener noreferrer">
                                    page de vos commandes
                                </a>.
                            </InfoPopover>
                        </Label>
                        <ImageUploader onChange={file => retrieveAndSetScreenshotUrl(file)}
                                       baseUrl={constants.BASE_PRODUCT_PICTURE_URL}
                                       src={orderScreenshotUrl}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>
                            Numéro de commande
                            <InfoPopover className="ml-3">
                                Vous pouvez facilement retrouver ce numéro sur la&nbsp;
                                <a href="https://www.amazon.fr/gp/css/order-history" target="_blank"
                                   rel="noopener noreferrer">
                                    page de vos commandes
                                </a>.<br/>
                                Sous le titre <b>N° DE COMMANDE</b>.
                            </InfoPopover>
                        </Label>
                        <Input type="text" name="orderId" className="form-control-alternative"
                               placeholder="405-9455016-XXXXXXX" onChange={e => setOrderId(e.target.value)}/>
                    </FormGroup>
                </Form>
            </div>
            <div className="modal-footer">
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
                    Fermer
                </Button>
                <Button color="primary" disabled={disabled} onClick={handleConfirm}>Confirmer</Button>
            </div>
        </Modal>
    )

};

OrderedProductModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    testId: PropTypes.string.isRequired
};

export default OrderedProductModal;