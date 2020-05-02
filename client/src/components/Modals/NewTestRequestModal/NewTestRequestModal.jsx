import React, {useState} from "react";
// reactstrap components
import {
    Button,
    Modal,
} from "reactstrap";
import userServices from '../../../services/user.services';
import testServices from '../../../services/test.services';
import constants from "../../../helpers/constants";
import SentRequest from "./SentRequest";
import PropTypes from "prop-types";
import SendRequestForm from "./SendRequestForm";
import LoginBody from "./LoginBody";
import BecomeTesterBody from "./BecomeTesterBody";

const {USER_ROLES} = constants;

const NewTestRequestModal = props => {

    const currentUser = userServices.currentUser;

    const {productId, disabled} = props;

    const [isLogged, setIsLogged] = useState(userServices.isAuth());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [testerMessage, setTesterMessage] = useState(isLogged ? currentUser.testerMessage : null);
    const [requestSent, setRequestSent] = useState(false);
    const [isTester, setIsTester] = useState(isLogged && currentUser.roles.includes(USER_ROLES.TESTER));

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setTesterMessage(isLogged ? currentUser.testerMessage : null);
        setRequestSent(false);
    };

    const confirmRequest = async () => {
        if (disabled) return;
        await testServices.create({
            product: productId,
            testerMessage
        });
        setRequestSent(true);
    };

    const renderModalBody = () => {
        if (requestSent) return <SentRequest/>;
        if (isLogged) {
            if (isTester) return <SendRequestForm value={testerMessage} onChange={val => setTesterMessage(val)}/>;
            return <BecomeTesterBody onSaved={() => setIsTester(true)}/>;
        }
        return <LoginBody onLogin={() => setIsLogged(true)}/>;
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
                    {renderModalBody()}
                </div>
                <div className="modal-footer">
                    <Button color="secondary" data-dismiss="modal" type="button" onClick={toggleModal}>
                        Fermer
                    </Button>
                    {isLogged && isTester && !requestSent ? (
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