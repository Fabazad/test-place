import React, {useState} from 'react';
import {Badge, Modal} from "reactstrap";
import Label from "reactstrap/lib/Label";
import {Link} from "react-router-dom";
import {formatDate} from "../../helpers/textHelpers";
import TestStatusIcon from "../TestStatusIcon";
import testServices from "../../services/test.services";
import {withTranslation} from "react-i18next";
import PropTypes from "prop-types";
import Button from "reactstrap/es/Button";

const TestRequestModal = (props) => {
    const {isOpen, onToggle, test, t} = props;

    const [statuses, setStatuses] = useState({});
    testServices.getTestStatuses().then(statuses => setStatuses(statuses));

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

                <div className="row bg-secondary py-3 rounded">
                    <div className="col-12 col-md-4 text-center">
                        <img src={test.product.imageUrls[0]} alt="" height='150' className='rounded shadow-lg'/>
                    </div>
                    <div className="col-12 col-md-8 d-flex mt-3 mt-md-0">
                        <div className='my-auto'>
                            <Label>Date de le demande :</Label> {formatDate(test.createdAt)}
                            <h4>
                                <Link to={'/ad/' + test.product._id} target='_blank'>{test.product.title}</Link>
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12 col-md-6 d-flex mt-3">
                        <div className='row w-100'>
                            <div className="col-6 text-center">
                                <Label>Prix initial</Label>
                                <h3>
                                    <Badge color={'primary'}>{test.product.price}€</Badge>
                                </h3>
                            </div>
                            <div className="col-6 text-center">
                                <Label>Prix Final</Label>
                                <h3>
                                    <Badge color={test.product.finalPrice > 0 ? 'warning' : 'success'}>
                                        {test.product.finalPrice}€
                                    </Badge>
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 mt-3">
                        <div className='row w-100'>
                            <div className="col-6 text-center">
                                <Label>Vendeur Test-Place</Label>
                                <Link to={'/profile/' + test.seller._id} target='_blank' className='d-block'>
                                    {test.seller.name}
                                </Link>
                            </div>
                            <div className="col-6 text-center">
                                <Label>Vendeur Amazon</Label>
                                {test.product.amazonSeller ? (
                                    <a href={test.product.amazonSeller.url} target='_blank' className='d-block'>
                                        {test.product.amazonSeller.name}
                                    </a>) : null}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3 bg-white border rounded py-3 shadow">
                    <div className="col-6 text-center">
                        <Label>Status de la demande</Label>
                        <div>
                            <TestStatusIcon status={test.status}/>
                            <span className="ml-2">{t(test.status)}</span>
                        </div>
                    </div>
                    <div className="col-6 text-center">
                        <Label>Date du changement de status</Label>
                        <div>{test.updates.length ? formatDate(test.updates.pop().date) : ''}</div>
                    </div>
                    {test.status === statuses['requestCancelled'] ?
                        <div className="col-12 text-center mt-3">
                            <Label>Raison de l'annulation</Label>
                            <div>
                                {test.cancelRequestReason}
                            </div>
                        </div> : null}
                    {test.status === statuses['requestDeclined'] ?
                        <div className="col-12 text-center mt-3">
                            <Label>Raison du refus</Label>
                            <div>
                                {test.declinedRaison}
                            </div>
                        </div> : null}
                    {test.status === statuses['requestAccepted'] ?
                        <div className="col-12 text-left mt-4 px-0 px-md-5">
                            <Label>Ensuite ?</Label>
                            <div>
                                Commandez le produit sur le site amazon en suivant ce lien :
                                <a href={'https://www.amazon.fr/dp/' + test.product.asin} target='_blank'> Lien Produit</a>.<br/>
                                Indiquez au vendeur lorsque vous commandez sur votre page
                                <Link to='' target='_blank'> Mes Tests en Cours</Link>.<br/>
                                Recevez votre colis, testez le, notez le et recevez votre compensation financière de la part du vendeur.
                            </div>
                        </div> : null}
                </div>

            </div>
            <div className="modal-footer">
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
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

export default withTranslation()(TestRequestModal);