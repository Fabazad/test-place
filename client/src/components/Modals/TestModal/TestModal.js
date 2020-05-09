import PropTypes from "prop-types";
import {Button, Modal} from "reactstrap";
import React from "react";
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

const TestModal = props => {

    const {isOpen, onToggle, test, userType, globalStatus, t} = props;

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
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    )
};

TestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    test: PropTypes.object.isRequired,
    userType: PropTypes.string.isRequired,
    globalStatus: PropTypes.string.isRequired
};

export default withTranslation()(TestModal);