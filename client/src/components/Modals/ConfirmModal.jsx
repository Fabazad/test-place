import Alert from "reactstrap/es/Alert";
import {Button, Modal} from "reactstrap";
import React, {useEffect, useState} from "react";
import confirmHelper from "../../helpers/confirmHelper";
import {withTranslation} from "react-i18next";

const ConfirmModal = ({t}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState("");
    const [callback, setCallback] = useState(null);

    useEffect(() => {
        confirmHelper.confirmSubject.subscribe(({text, callback}) => {
            setText(text);
            setCallback(() => callback);
            toggleModal();
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleConfirm = () => {
        if (callback) {
            toggleModal();
            callback();
        }
    };

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={toggleModal}>
            <div className="modal-header">
                <h2 className="modal-title">Confirmation</h2>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={toggleModal}>
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body pb-0">
                <Alert className="alert-info">
                    {text}
                </Alert>
            </div>
            <div className="modal-footer">
                <Button color="secondary" data-dismiss="modal" type="button" onClick={toggleModal}>
                    {t("CLOSE")}
                </Button>
                <Button color="primary" onClick={handleConfirm}>{t("CONFIRM")}</Button>
            </div>
        </Modal>
    )
};

export default withTranslation()(ConfirmModal);