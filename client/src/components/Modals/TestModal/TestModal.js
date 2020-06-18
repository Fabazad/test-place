import PropTypes from "prop-types";
import {Badge, Button, Modal} from "reactstrap";
import React, {useEffect, useState} from "react";
import Label from "reactstrap/lib/Label";
import {formatDate} from "../../../helpers/textHelpers";
import {Link} from "react-router-dom";
import ModalBody from "reactstrap/es/ModalBody";
import ModalFooter from "reactstrap/es/ModalFooter";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import TestPrices from "./TestPrices";
import SellerTesterInfo from "./SellerTesterInfo";
import TestStatusIcon from "../../TestStatusIcon";
import {withTranslation} from "react-i18next";
import TestProcessInfo from "./TestProcessInfo";
import Container from "reactstrap/es/Container";
import testServices from "../../../services/test.services";
import constants from "../../../helpers/constants";
import Card from "reactstrap/es/Card";
import CardBody from "reactstrap/es/CardBody";

const {USER_ROLES} = constants;

const TestModal = props => {

    const {isOpen, onToggle, userType, globalStatus, testId, t} = props;

    const [test, setTest] = useState(null);

    useEffect(() => {
        testServices.getOne(testId).then(setTest);
    }, [testId]);

    if (!test) return null;

    const lastUpdate = test.updates && test.updates.length ? test.updates[test.updates.length - 1] : {};

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle} size="lg">
            <div className="modal-header">
                <h3 className="modal-title mb-0">
                    Test Détails
                </h3>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={onToggle}>
                    <span aria-hidden={true}>×</span>
                </button>
            </div>

            <ModalBody>
                <Container>
                    <Row className="bg-secondary py-4 rounded">
                        <Col xs={12} md={4} className="text-center">
                            <img src={test.product.imageUrls[0]} alt="" height='150' className='rounded shadow-lg'/>
                        </Col>

                        <Col xs={12} md={8} className="d-flex mt-3 mt-md-0">
                            <div className='my-auto'>
                                <Label>Date de le demande :</Label> {formatDate(test.createdAt)}
                                <h4>
                                    <Link to={'/ad/' + test.product._id} target='_blank' rel="noopener noreferrer">
                                        {test.product.title}
                                    </Link>
                                </h4>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} md={6} className="d-flex mt-3">
                            <TestPrices price={test.product.price} finalPrice={test.product.finalPrice}/>
                        </Col>

                        <Col xs="12" md="6" className="d-flex mt-3">
                            <SellerTesterInfo userRole={userType} tester={test.tester} seller={test.seller}
                                              amazonSeller={test.product.amazonSeller}/>
                        </Col>
                    </Row>

                    {userType === USER_ROLES.SELLER ? (
                        <Row className="mt-3">
                            <Col xs={12} md={4} className="text-center">
                                <Label>Paypal Email</Label>
                                <div>
                                    {test.tester.paypalEmail}
                                </div>
                            </Col>
                            {test.orderId ? (
                                <Col xs={12} md={4} className="text-center">
                                    <Label>Numéro de Commande</Label>
                                    <div>
                                        <Badge color='info'>{test.orderId}</Badge>
                                    </div>
                                </Col>
                            ) : null}
                            {test.orderScreenshotUrl ? (
                                <Col xs={12} md={4} className="text-center">
                                    <Label>Capture d'écran</Label>
                                    <div>
                                        <a href={test.orderScreenshotUrl} target="_blank" rel="noopener noreferrer">
                                            Image</a>
                                    </div>
                                </Col>
                            ) : null}
                            {test.reviewUrl ? (
                                <Col xs={12} md={4} className="text-center">
                                    <Label>Lien du commentaire</Label>
                                    <div>
                                        <a href={test.reviewUrl} target="_blank" rel="noopener noreferrer">
                                            Lien
                                        </a>
                                    </div>
                                </Col>
                            ) : null}
                            {test.product.privateNote ? (
                                <Col xs={12} className="mt-3">
                                    <Card>
                                        <CardBody>
                                            <Label>Notes privées</Label>
                                            <small className="d-block">
                                                {test.product.privateNote}
                                            </small>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ): null}
                        </Row>
                    ) : null}

                    <Row className="mt-3 bg-white border rounded py-4 shadow">
                        <Col xs={6} className="text-center">
                            <Label>Status de la demande</Label>
                            <div>
                                <TestStatusIcon status={test.status} globalStatus={globalStatus}/>
                                <span className="ml-2">{t(test.status)}</span>
                            </div>
                        </Col>
                        <Col xs={6} className="text-center">
                            <Label>Date du changement de status</Label>
                            <div>{lastUpdate ? formatDate(lastUpdate.date) : '-'}</div>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col xs={12}>
                            <TestProcessInfo test={test} userRole={userType} onToggle={onToggle}/>
                        </Col>
                    </Row>
                </Container>
            </ModalBody>

            <ModalFooter>
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
                    Fermer
                </Button>
            </ModalFooter>
        </Modal>
    )
};

TestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    testId: PropTypes.string.isRequired,
    userType: PropTypes.string.isRequired,
    globalStatus: PropTypes.string.isRequired
};

export default withTranslation()(TestModal);