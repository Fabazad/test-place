import React from "react";
import AnimatedCheck from "../AnimatedCheck";
import {Link} from "react-router-dom";
import {Button, Modal} from "reactstrap";
import PropTypes from "prop-types";
import {withTranslation} from "react-i18next";

const NewTestModal = (props) => {
    const {isOpen, onToggle, t} = props;

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle}>
            <div className="modal-header">
                <h2 className="modal-title">{t("TEST_REQUEST_ACCEPTED")}</h2>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={onToggle}>
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body text-center">
                <AnimatedCheck/>
                <p className="mt-5 h4 white-space-pre-line">
                    {t("TEST_REQUEST_ACCEPTED_AND_NEXT_STEP")}
                    {" "}
                    <Link to="/dashboard/my-current-tests">{t("MY_CURRENT_TEST")}</Link>
                </p>
            </div>
            <div className="modal-footer">
                <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
                    {t("CLOSE")}
                </Button>
            </div>
        </Modal>
    )
};

NewTestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired
};

export default withTranslation()(NewTestModal);