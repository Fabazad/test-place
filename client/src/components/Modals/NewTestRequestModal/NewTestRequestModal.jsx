import React, {useEffect, useState} from "react";
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
import Loading from "../../Loading";
import {toast} from "react-toastify";
import {withTranslation} from "react-i18next";

const {USER_ROLES} = constants;

const NewTestRequestModal = props => {

    const {productId, disabled, t} = props;

    const isLogged = userServices.isAuth();

    const [user, setUser] = useState(userServices.currentUser);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [testerMessage, setTesterMessage] = useState(isLogged ? user.testerMessage : null);
    const [requestSent, setRequestSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const isTester = isLogged && user.roles.includes(USER_ROLES.TESTER);

    useEffect(() => {
        const subscriber = userServices.currentUserSubject.subscribe(setUser);
        return () => subscriber.unsubscribe();
    }, []);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setTesterMessage(isLogged ? user.testerMessage : null);
        setRequestSent(false);
    };

    const confirmRequest = async () => {
        if (disabled) return;
        if (!testerMessage) {
            toast.error(t("MISSING_MESSAGE_TO_SELLER"));
            return;
        }
        setLoading(true);
        try {
            await testServices.create({
                product: productId,
                testerMessage
            });
            setRequestSent(true);
        } catch(err) {
            console.error(err);
        }
        setLoading(false);
    };

    const renderModalBody = () => {
        if (requestSent) return <SentRequest/>;
        if (isLogged) {
            if (user.paypalEmail && user.amazonId) {
                return <SendRequestForm value={testerMessage ?? ''} onChange={val => setTesterMessage(val)}/>;
            }
            return <BecomeTesterBody/>;
        }
        return <LoginBody/>;
    };

    return (
        <>
            {/* Button trigger modal */}
            <Button className='mt-3 w-100' color="primary" type="button" size="lg" disabled={disabled}
                    onClick={toggleModal}>
                {t("REQUEST_FOR_TESTING")}
            </Button>
            {/* Modal */}
            <Modal className="modal-dialog-centered" isOpen={isModalOpen} toggle={toggleModal}>
                <div className="modal-header">
                    <h2 className="modal-title">{t("REQUEST_FOR_TESTING")}</h2>
                    <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                            onClick={toggleModal}>
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body text-center">
                    <Loading loading={loading}/>
                    {renderModalBody()}
                </div>
                <div className="modal-footer">
                    <Button color="secondary" data-dismiss="modal" type="button" onClick={toggleModal}>
                        {t("CLOSE")}
                    </Button>
                    {isLogged && isTester && !requestSent && user.paypalEmail && user.amazonId ? (
                        <Button color={'primary'} type='button' onClick={confirmRequest}>
                            {t("CONFIRM_REQUEST")}
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

export default withTranslation()(NewTestRequestModal);