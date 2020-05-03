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
import Alert from "reactstrap/es/Alert";
import AnswerTestRequestForm from "../Forms/AnswerTestRequestForm";
import constants from "../../helpers/constants";
import {getAmazonProfileUrl} from "../../helpers/urlHelpers";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";

const {USER_ROLES, TEST_GLOBAL_STATUSES} = constants;

const TestRequestModal = (props) => {
    const {isOpen, onToggle, test, userType, t} = props;

    const userTypes = USER_ROLES;

    const [statuses, setStatuses] = useState({});
    testServices.getTestStatuses().then(statuses => setStatuses(statuses));

    const onAnswerTestSubmit = () => {
        testServices.testsSubject.next();
        onToggle();
    };

    if (!test) return '';

    const lastUpdate = test.updates && test.updates.length ? test.updates[test.updates.length - 1] : {};

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

                <div className="row bg-secondary py-4 rounded">
                    <div className="col-12 col-md-4 text-center">
                        <img src={test.product.imageUrls[0]} alt="" height='150' className='rounded shadow-lg'/>
                    </div>
                    <div className="col-12 col-md-8 d-flex mt-3 mt-md-0">
                        <div className='my-auto'>
                            <Label>Date de le demande :</Label> {formatDate(test.createdAt)}
                            <h4>
                                <Link to={'/ad/' + test.product._id} target='_blank' rel="noopener noreferrer">
                                    {test.product.title}
                                </Link>
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
                    {userType === userTypes.TESTER ? <div className="col-12 col-md-6 mt-3">
                        <div className='row w-100'>
                            <div className="col-6 text-center">
                                <Label>Vendeur Test-Place</Label>
                                <Link to={'/profile/' + test.seller._id} target='_blank' className='d-block'
                                      rel="noopener noreferrer">
                                    {test.seller.name}
                                </Link>
                            </div>
                            <div className="col-6 text-center">
                                <Label>Vendeur Amazon</Label>
                                {test.product.amazonSeller ? (
                                    <a href={test.product.amazonSeller.url} target='_blank' className='d-block'
                                       rel="noopener noreferrer">
                                        {test.product.amazonSeller.name}
                                    </a>) : null}
                            </div>
                        </div>
                    </div> : null}
                    {userType === userTypes.SELLER ? (
                        <div className="col-12 col-md-6 mt-3 text-center">
                            <Row>
                                <Col xs={6} className="text-center">
                                    <Label>Testeur</Label>
                                    <a href={'/profile/' + test.tester._id} target='_blank' className='d-block'
                                       rel="noopener noreferrer">
                                        {test.tester.name}
                                    </a>
                                </Col>
                                <Col xs={6} className="text-center">
                                    <Label>Amazon</Label>
                                    <a href={getAmazonProfileUrl(test.tester.amazonId)} target='_blank'
                                       className='d-block' rel="noopener noreferrer">
                                        Profile
                                    </a>
                                </Col>
                            </Row>
                        </div>) : null}
                </div>

                <div className="row mt-3 bg-white border rounded py-4 shadow">
                    <div className="col-6 text-center">
                        <Label>Status de la demande</Label>
                        <div>
                            <TestStatusIcon status={test.status} globalStatus={TEST_GLOBAL_STATUSES.REQUESTED}/>
                            <span className="ml-2">{t(test.status)}</span>
                        </div>
                    </div>
                    <div className="col-6 text-center">
                        <Label>Date du changement de status</Label>
                        <div>{lastUpdate ? formatDate(lastUpdate.date) : '-'}</div>
                    </div>

                    {test.status === statuses['requestCancelled'] && test.cancelRequestReason ?
                        <div className="col-12 text-center mt-3">
                            <Label>Raison de l'annulation</Label>
                            <Alert color="default">
                                {test.cancelRequestReason}
                            </Alert>
                        </div> : null}
                    {test.status === statuses['requestDeclined'] && test.declineRequestReason ?
                        <div className="col-12 text-center mt-3">
                            <Label>Raison du refus</Label>
                            <Alert color="danger">
                                {test.declineRequestReason}
                            </Alert>
                        </div> : null}
                    {test.status === statuses['requestAccepted'] && userTypes.TESTER === userType ?
                        <div className="col-12 text-left mt-4 px-md-5">
                            {test.sellerMessage ?
                                <div className="mb-3">
                                    <Label>Message du Vendeur - <Link to={'#'}>{test.seller.name}</Link></Label>
                                    <Alert color="success">
                                        {test.sellerMessage}
                                    </Alert>
                                </div> : null}
                            <Label>Ensuite ?</Label>
                            <Alert color="success">
                                Commandez le produit sur le site amazon en suivant ce lien :
                                <a href={'https://www.amazon.fr/dp/' + test.product.asin} target='_blank'
                                   rel="noopener noreferrer"> Lien
                                    Produit</a>.<br/>
                                Indiquez au vendeur lorsque vous commandez sur votre page
                                <Link to='/dashboard/my-current-tests'> Mes Tests en Cours</Link>.<br/>
                                Recevez votre colis, testez le, notez le et recevez votre compensation financière de la
                                part du vendeur.
                            </Alert>
                        </div> : null}
                    {test.status === statuses['requestAccepted'] && userTypes.SELLER === userType ?
                        <div className="col-12 text-left mt-4 px-md-5">
                            <Label>Ensuite ?</Label>
                            <Alert color="success">
                                Attendez que le testeur achète et test le produit.<br/>
                                Vous pouvez suivre l'avancer du test sur votre page
                                <Link to={'/dashboard/my-current-tests'}> Mes Tests en Cours</Link>.
                            </Alert>
                        </div> : null}
                    {test.status === statuses['requested'] && userTypes.TESTER === userType ?
                        <div className="col-12 text-left mt-4 px-md-5">
                            <Label>Ensuite ?</Label>
                            <Alert color="warning">
                                En attente d'acceptation.<br/>
                                Pour l'instant, tout ce que vous avez à faire est d'attendre la réponse du vendeur.<br/>
                                N'achetez donc pas encore le produit.
                            </Alert>
                        </div> : null}
                    {test.status === statuses['requested'] && userTypes.SELLER === userType && test.testerMessage ?
                        <div className="col-12 text-left mt-4 px-md-5">
                            <Label>Message du testeur</Label>
                            <Alert color="info">
                                {test.testerMessage}
                            </Alert>
                        </div> : null}
                </div>
                {test.status === statuses['requested'] && userTypes.SELLER === userType ?
                    <div className="text-center bg-secondary p-3 mt-3 rounded">
                        <AnswerTestRequestForm onSubmit={onAnswerTestSubmit} testId={test._id}/>
                    </div> : null}

            </div>
            <div className="modal-footer">
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
                    Fermer
                </Button>
            </div>
        </Modal>
    );
};

TestRequestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    test: PropTypes.object,
    userType: PropTypes.string.isRequired
};

export default withTranslation()(TestRequestModal);