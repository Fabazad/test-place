import React, {useState} from "react";
// reactstrap components
import {
    Button,
    Modal,
} from "reactstrap";
import userServices from '../../../services/user.services';
import testServices from '../../../services/test.services';
import {Link} from "react-router-dom";
import AnimatedError from "../../AnimatedError";
import constants from "../../../helpers/constants";
import SentRequest from "./SentRequest";
import PropTypes from "prop-types";
import SendRequestForm from "./SendRequestForm";

const {USER_ROLES} = constants;

const NewTestRequestModal = props => {

    const currentUser = userServices.currentUser;

    const {productId, disabled} = props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [testerMessage, setTesterMessage] = useState(userServices.isAuth() ? currentUser.testerMessage : null);
    const [requestSent, setRequestSent] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setTesterMessage(userServices.isAuth() ? currentUser.testerMessage : null);
        setRequestSent(false);
    };

    const confirmRequest = async () => {
        await testServices.create({
            product: this.props.productId,
            testerMessage: this.state.testerMessage
        });
        setRequestSent(true);
    };

    return (
        <>
            {/* Button trigger modal */}
            <Button className='mt-3 w-100' color="primary" type="button" size="lg" disabled={disabled}
                    onClick={toggleModal}>
                Demander à Tester
            </Button>
            {/* Modal */}
            <Modal className="modal-dialog-centered" isOpen={isModalOpen} toggle={toggleModal}>
                <div className="modal-header">
                    <h2 className="modal-title">Demande de Test</h2>
                    <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                            onClick={toggleModal}>
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body text-center">
                    {requestSent ? <SentRequest/> : (
                        <>
                            {userServices.isAuth() ?
                                currentUser.roles.includes(USER_ROLES.TESTER) ? (
                                    <SendRequestForm value={testerMessage} onChange={val => setTesterMessage(val)}/>
                                ) : null
                                : (
                                    <div>
                                        {/* Logged out case*/}
                                        <AnimatedError/>
                                        <p>Vous devez être connecté pour demander à tester un produit.</p>
                                        <Button color={'primary'} to={'/login'} tag={Link}>Se Connecter</Button>
                                        <Link to={'/register'} className="ml-3">Créer un compte</Link>
                                    </div>
                                )}
                        </>
                    )}

                </div>
                <div className="modal-footer">
                    <Button color="secondary" data-dismiss="modal" type="button" onClick={toggleModal}>
                        Fermer
                    </Button>
                    {userServices.isAuth() && currentUser.amazonId && currentUser.paypalEmail && !requestSent ? (
                        //TODO add true on local
                        <Button color={'primary'} type='button' onClick={confirmRequest}>
                            Confirmer la Demande
                        </Button>
                    ) : null}
                </div>
            </Modal>
        </>
    );
};

NewTestRequestModal.propTypes = {
    productId: PropTypes.string.isRequired,
    disabled: PropTypes.bool
};

export default NewTestRequestModal;