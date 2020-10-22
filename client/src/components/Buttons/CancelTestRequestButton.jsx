import React, {useState} from "react";
// reactstrap components
import PropTypes from "prop-types";
import CancelTestRequestModal from "../Modals/CancelTestRequestModal";
import RowActionButton from "./RowActionButton";
import {withTranslation} from "react-i18next";

const CancelTestRequestButton = props => {

    const {t, testId} = props;

    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <RowActionButton title={t("CANCEL")} icon="fa fa-times" color="danger" onClick={toggleModal}/>
            <CancelTestRequestModal isOpen={isOpen} onClose={toggleModal} testId={testId}/>
        </>
    );
};

CancelTestRequestButton.propTypes = {
    testId: PropTypes.string.isRequired
};

export default withTranslation()(CancelTestRequestButton);