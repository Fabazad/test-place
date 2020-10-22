import PropTypes from "prop-types";
import CancelTestRequestButton from "./CancelTestRequestButton";
import RowActionButton from "./RowActionButton";
import {getAmazonReviewUrl, getProductAmazonUrl} from "../../helpers/urlHelpers";
import React from "react";
import constants from "../../helpers/constants";
import testServices from "../../services/test.services";
import {toast} from "react-toastify";
import confirmHelper from "../../helpers/confirmHelper";
import {withTranslation} from "react-i18next";

const {TEST_GLOBAL_STATUSES, TEST_ROW_CLICK_ACTIONS, USER_ROLES} = constants;

const TestListButtons = props => {

    const {globalStatus, test, userRole, onClick, statuses, t} = props;

    const actionService = (status, successToast) => {
        testServices.updateStatus(test._id, status)
            .then(() => {
                testServices.testsSubject.next();
                toast.success(successToast)
            });
    };

    const confirmAction = action => {
        const actionsMapping = {
            [TEST_ROW_CLICK_ACTIONS.PRODUCT_RECEIVED]: {
                text: t("PRODUCT_RECEIVED_TEXT"),
                status: t(statuses['productReceived']),
                successText: t("PRODUCT_RECEIVED_TEXT_SUCCESS_TEXT")
            },
            [TEST_ROW_CLICK_ACTIONS.REVIEW_VALIDATED]: {
                text: t("REVIEW_VALIDATED_TEXT"),
                status: t(statuses['reviewValidated']),
                successText: t("REVIEW_VALIDATED_SUCCESS_TEXT")
            },
            [TEST_ROW_CLICK_ACTIONS.MONEY_SENT]: {
                text: t("MONEY_SENT_TEXT"),
                status: t(statuses['moneySent']),
                successText: t("MONEY_SENT_SUCCESS_TEXT")
            },
            [TEST_ROW_CLICK_ACTIONS.MONEY_RECEIVED]: {
                text: t("MONEY_RECEIVED_TEXT"),
                status: t(statuses['moneyReceived']),
                successText: t("MONEY_RECEIVED_SUCCESS_TEXT")
            }
        };

        const actionData = actionsMapping[action];
        if (actionData) {
            confirmHelper.confirm(actionData.text, () => actionService(actionData.status, actionData.successTest));
        }
    };

    return (
        <>
            {globalStatus === TEST_GLOBAL_STATUSES.REQUESTED ? (
                <>
                    <RowActionButton
                        title={t("SEE")} icon="fa fa-eye" color="info"
                        onClick={() => onClick(TEST_ROW_CLICK_ACTIONS.SHOW_TEST)}/>
                    {test.status === statuses.requested && userRole === USER_ROLES.TESTER ? (
                        <CancelTestRequestButton testId={test._id}/>) : null}
                </>
            ) : null}

            {globalStatus === TEST_GLOBAL_STATUSES.PROCESSING ? (
                <>
                    <RowActionButton
                        color='info' icon='fa fa-eye' title={t("SEE")}
                        onClick={() => onClick(TEST_ROW_CLICK_ACTIONS.SHOW_TEST)}/>

                    {userRole === USER_ROLES.TESTER ? (
                        <>
                            {test.status === statuses["requestAccepted"] ? (
                                <RowActionButton
                                    title={t("BUY_PRODUCT")} icon="fab fa-amazon" color="default"
                                    onClick={() => window.open(getProductAmazonUrl(test.product.asin, test.product.keywords), '_blank')}/>
                            ) : null}
                            {test.status === statuses["requestAccepted"] ? (
                                <RowActionButton
                                    title={t("PRODUCT_ORDERED")} icon="fa fa-shopping-cart" color="warning"
                                    onClick={() => onClick(TEST_ROW_CLICK_ACTIONS.PRODUCT_ORDERED)}/>
                            ) : null}
                            {test.status === statuses["productOrdered"] ? (
                                <RowActionButton
                                    title={t("PRODUCT_RECEIVED")} icon="fa fa-box-open" color="warning"
                                    onClick={() => confirmAction(TEST_ROW_CLICK_ACTIONS.PRODUCT_RECEIVED)}/>
                            ) : null}

                            {test.status === statuses["productReceived"] ? (
                                <RowActionButton
                                    title={t("PRODUCT_REVIEWED")} icon="fa fa-star" color="warning"
                                    onClick={() => onClick(TEST_ROW_CLICK_ACTIONS.PRODUCT_REVIEWED)}/>
                            ) : null}
                            {[statuses["reviewValidated"], statuses["moneySent"]].includes(test.status) ? (
                                <RowActionButton
                                    title={t("MONEY_RECEIVED")} icon="fa fa-dollar-sign" color="success"
                                    onClick={() => confirmAction(TEST_ROW_CLICK_ACTIONS.MONEY_RECEIVED)}/>
                            ) : null}
                        </>
                    ) : null}

                    {userRole === USER_ROLES.SELLER ? (
                        <>
                            {test.status === statuses["productReviewed"] ? (
                                <>
                                    <RowActionButton
                                        title={t("REVIEW_LINK")} icon="fab fa-amazon" color="default"
                                        onClick={() => window.open(getAmazonReviewUrl(test.reviewId), '_blank')}/>
                                    <RowActionButton
                                        title={t("DECLINE_REVIEW")} icon="fa fa-thumbs-down"
                                        color="danger" onClick={() => onClick(TEST_ROW_CLICK_ACTIONS.REVIEW_DECLINED)}/>
                                    <RowActionButton
                                        title={t("VALIDATE_REVIEW")} icon="fa fa-thumbs-up" color="success"
                                        onClick={() => confirmAction(TEST_ROW_CLICK_ACTIONS.REVIEW_VALIDATED)}/>
                                </>
                            ) : null}
                            {test.status === statuses["reviewValidated"] ? (
                                <RowActionButton
                                    title={t("MONEY_SENT")} icon="fa fa-dollar-sign" color="success"
                                    onClick={() => confirmAction(TEST_ROW_CLICK_ACTIONS.MONEY_SENT)}/>
                            ) : null}
                        </>
                    ) : null}

                    {test.status !== statuses["testCancelled"]
                    && (test.status !== statuses['productReviewed'] || userRole === USER_ROLES.TESTER) ?
                        <RowActionButton title={t("CANCEL_TEST")} icon="fa fa-times" color="danger"
                                         onClick={() => onClick(TEST_ROW_CLICK_ACTIONS.CANCEL_TEST)}/> : null
                    }

                </>
            ) : null}

            {globalStatus === TEST_GLOBAL_STATUSES.COMPLETED ? (
                <>
                    <RowActionButton
                        color='info' icon='fa fa-eye' title={t("SEE")}
                        onClick={() => onClick(TEST_ROW_CLICK_ACTIONS.SHOW_TEST)}/>
                </>
            ) : null}
        </>
    )
};

TestListButtons.propTypes = {
    test: PropTypes.object.isRequired,
    userRole: PropTypes.string.isRequired,
    globalStatus: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    statuses: PropTypes.object.isRequired
};

export default withTranslation()(TestListButtons);