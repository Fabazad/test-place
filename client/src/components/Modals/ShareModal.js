import {Button, Modal} from "reactstrap";
import React from "react";
import ModalFooter from "reactstrap/es/ModalFooter";
import ModalBody from "reactstrap/es/ModalBody";
import PropTypes from "prop-types";
import {
    EmailShareButton,
    PocketShareButton,
    TelegramShareButton,
    TwitterShareButton,
    ViberShareButton,
    WhatsappShareButton,
} from "react-share";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";

const ShareModal = ({onToggle, isOpen}) => {

    const url = "testplace.io";

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle}>
            <div className="modal-header">
                <h4 className="m-0">Partager</h4>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={onToggle}>
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <ModalBody>
                <Row className='px-5'>
                    <Col xs={4} md={2}>
                        <EmailShareButton
                            url={url} id="email-share"
                            subject="Découvrir Test Place"
                            body="Salut :) Je te laisse essayer ce site, tu vas adorer !"
                        >
                            <Button className="btn-icon-only rounded-circle border-0" color="light" type="button">
                        <span className="btn-inner--icon m-0">
                            <i className="ni ni-email-83"/>
                        </span>
                            </Button>
                        </EmailShareButton>
                        <UncontrolledTooltip target="email-share">Email</UncontrolledTooltip>
                    </Col>
                    <Col xs={4} md={2}>
                        <PocketShareButton url={url} title="Test Place" id="pocket-share">
                            <Button className="btn-icon-only rounded-circle border-0" color="danger" type="button">
                                <span className="btn-inner--icon m-0">
                                    <i className="fab fa-get-pocket"/>
                                </span>
                            </Button>
                        </PocketShareButton>
                        <UncontrolledTooltip target="pocket-share">Pocket</UncontrolledTooltip>
                    </Col>
                    <Col xs={4} md={2}>
                        <TelegramShareButton url={url} title="Test Place" id="telegram-share">
                            <Button className="btn-icon-only rounded-circle border-0" color="primary" type="button">
                                <span className="btn-inner--icon m-0">
                                    <i className="fab fa-telegram-plane"/>
                                </span>
                            </Button>
                        </TelegramShareButton>
                        <UncontrolledTooltip target="telegram-share">Telegram</UncontrolledTooltip>
                    </Col>
                    <Col xs={4} md={2} className="mt-3 mt-md-0">
                        <TwitterShareButton url={url} title="Test Place" id='twitter-share'>
                            <Button className="btn-icon-only rounded-circle border-0" color="info" type="button">
                                <span className="btn-inner--icon m-0">
                                    <i className="fab fa-twitter"/>
                                </span>
                            </Button>
                        </TwitterShareButton>
                        <UncontrolledTooltip target="twitter-share">Twitter</UncontrolledTooltip>
                    </Col>
                    <Col xs={4} md={2} className="mt-3 mt-md-0">
                        <ViberShareButton url={url} title="Salut :) Je te laisse essayer ce site, tu vas adorer !"
                                          id="viber-share">
                            <Button className="btn-icon-only rounded-circle border-0 bg-purple text-white"
                                    type="button">
                                <span className="btn-inner--icon m-0">
                                    <i className="fab fa-viber"/>
                                </span>
                            </Button>
                        </ViberShareButton>
                        <UncontrolledTooltip target="viber-share">Viber</UncontrolledTooltip>
                    </Col>
                    <Col xs={4} md={2} className="mt-3 mt-md-0">
                        <WhatsappShareButton url={url} title="Test Place" id="whatsapp-share">
                            <Button className="btn-icon-only rounded-circle border-0 btn-slack" type="button">
                                <span className="btn-inner--icon m-0">
                                    <i className="fab fa-whatsapp"/>
                                </span>
                            </Button>
                        </WhatsappShareButton>
                        <UncontrolledTooltip target="whatsapp-share">WhatsApp</UncontrolledTooltip>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
                    Fermer
                </Button>
            </ModalFooter>
        </Modal>
    )
};

ShareModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default ShareModal;