import PropTypes from "prop-types";
import Label from "reactstrap/lib/Label";
import Alert from "reactstrap/es/Alert";
import {Link} from "react-router-dom";
import AnswerTestRequestForm from "../../Forms/AnswerTestRequestForm";
import React, {useEffect, useState} from "react";
import testServices from "../../../services/test.services";
import constants from "../../../helpers/constants";
import NextStepAdvice from "./NextStepAdvice";
import {getAmazonReviewUrl, getProductAmazonUrl} from "../../../helpers/urlHelpers";
import ReviewAdvices from "../../ReviewAdvices";
import {withTranslation} from "react-i18next";
import {isTestStatus} from "../../../helpers/isTestStatus";

const {USER_ROLES} = constants;

const TestProcessInfo = ({test, userRole, onToggle, adminView, t}) => {

    const [statuses, setStatuses] = useState({});
    useEffect(() => {
        testServices.getTestStatuses().then(setStatuses);
    }, []);

    const onAnswerTestSubmit = () => {
        testServices.testsSubject.next();
        onToggle();
    };

    const isStatus = statusesToCheck => isTestStatus({statusesToCheck, test, statuses})

    return (
        <>
            {isStatus('requestCancelled') && test.cancelRequestReason ?
                <div className="w-100">
                    <Label>{t("CANCELLATION_REASON")}</Label>
                    <Alert color="default" className="white-space-pre-line">
                        {test.cancelRequestReason}
                    </Alert>
                </div> : null}
            {isStatus('requestDeclined') && test.declineRequestReason ?
                <div className="w-100">
                    <Label>{t("DECLINE_REASON")}</Label>
                    <Alert color="danger" className="white-space-pre-line">
                        {test.declineRequestReason}
                    </Alert>
                </div> : null}
            {isStatus('requested') && (USER_ROLES.TESTER === userRole || adminView) ?
                <NextStepAdvice color="info">
                    {t("WAITING_FOR_TEST_REQUEST_ACCEPTATION")}
                </NextStepAdvice> : null}
            {isStatus('requested') && (USER_ROLES.SELLER === userRole || adminView) ?
                <NextStepAdvice color="info">
                    Vous devez accepter ou refuser la demande de test.
                </NextStepAdvice> : null}
            {test.testerMessage ?
                <div className="text-left w-100">
                    <Label>{t("TESTER_MESSAGE")} - <b>{test.tester.name}</b></Label>
                    <Alert color="primary" className="white-space-pre-line">
                        {test.testerMessage}
                    </Alert>
                </div> : null}
            {isStatus('requested') && (USER_ROLES.SELLER === userRole || adminView) ?
                <div className="text-center bg-secondary p-3 w-100 rounded">
                    <AnswerTestRequestForm onSubmit={onAnswerTestSubmit} testId={test._id}/>
                </div> : null}
            {test.sellerMessage ?
                <div className="text-left w-100">
                    {test.sellerMessage ?
                        <div className="mb-3">
                            <Label>{t("SELLER_MESSAGE")} - <b>{test.seller.name}</b></Label>
                            <Alert color="success" className="white-space-pre-line">
                                {test.sellerMessage}
                            </Alert>
                        </div> : null}
                </div> : null
            }
            {isStatus('requestAccepted') && (USER_ROLES.TESTER === userRole || adminView) ?
                <NextStepAdvice color="info">
                    {t("ORDER_PRODUCT_FOLLOW_LINK")}{" "}
                    <a href={getProductAmazonUrl(test.product.asin, test.product.keywords)} target='_blank'
                       rel="noopener noreferrer">
                        {t("PRODUCT_LINK")}
                    </a>.<br/>
                    {t("INDICATE_ON_PRODUCT_ORDER")}
                </NextStepAdvice> : null
            }
            {isStatus(['requestAccepted', 'productOrdered', 'productReceived']) && (USER_ROLES.SELLER === userRole || adminView) ?
                <NextStepAdvice color="info">
                    {t("WAIT_FOR_TESTER_TO_BUY_PRODUCT")}<br/>
                    <ReviewAdvices/>
                    {t("YOU_CAN_FOLLOW_THE_TEST_PROCESS")}
                </NextStepAdvice> : null}
            {isStatus('productOrdered') && (USER_ROLES.TESTER === userRole || adminView) ?
                <NextStepAdvice color="info">
                    {t("INDICATE_ON_PRODUCT_RECEPTION")}
                </NextStepAdvice> : null}
            {isStatus('productReceived') && (USER_ROLES.TESTER === userRole || adminView) ?
                <NextStepAdvice color="info">
                    {t("TEST_AND_REVIEW_PRODUCT")}<br/>
                    <ReviewAdvices/>
                    {t("REVIEW_INFO")}
                </NextStepAdvice> : null}
            {isStatus('productReviewed') && (USER_ROLES.TESTER === userRole || adminView) ?
                <NextStepAdvice color="info">
                    {t("WAIT_FOR_REVIEW_TO_BE_ACCEPTED")}
                </NextStepAdvice> : null}
            {isStatus('productReviewed') && (USER_ROLES.SELLER === userRole || adminView) && test.reviewId ?
                <NextStepAdvice color="info">
                    {t("TESTER_HAS_REVIEWED_PRODUCT")}<br/>
                    {t("YOU_WILL_FIND_THE")}{" "}<a
                    href={getAmazonReviewUrl(test.reviewId)}>{t("REVIEW_LINK")}</a>.<br/>
                </NextStepAdvice> : null}
            {test.declineReviewReason ?
                <div className="text-left w-100">
                    <div className="mb-3">
                        <Label>{t("DECLINE_REASON")} - <Link to={'#'}>{test.seller.name}</Link></Label>
                        <Alert color="danger" className="white-space-pre-line">
                            {test.declineReviewReason}
                        </Alert>
                    </div>
                </div> : null
            }
            {isStatus("reviewDeclined") && !test.adminMessage ?
                <NextStepAdvice color="info">
                    {t("ADMIN_WILL_MANAGE")}
                </NextStepAdvice> : null}
            {isStatus("reviewValidated") && (userRole === USER_ROLES.TESTER || adminView) ?
                <NextStepAdvice color="info">
                    {t("REVIEW_HAS_BEEN_VALIDATED")}<br/>
                    {t("DONT_HESITATE_TO")}{" "}
                    <a className="cursor-pointer text-primary"
                       onClick={() => window.$crisp.push(["do", "chat:open"])}>
                        {t("CONTACT_US")}
                    </a>, {(t("WITH_COMMAND_NUMBER"))}
                </NextStepAdvice> : null
            }
            {isStatus("reviewValidated") && (userRole === USER_ROLES.SELLER || adminView) ?
                <NextStepAdvice color="info">
                    {t("YOU_NEED_TO_REFUND")}<br/>
                    {t("SUM_TO_REFUND")} : {test.product.price}€ - {test.product.finalPrice}€.<br/>
                    {t("SO")} {test.product.price - test.product.finalPrice}€.<br/>
                    {t("THINK_ABOUT_PAYPAL_FEES")}
                </NextStepAdvice> : null
            }
            {isStatus("moneySent") && (userRole === USER_ROLES.TESTER || adminView) ?
                <NextStepAdvice color="info">
                    Le remboursement a été envoyé par le vendeur sur votre compte Paypal.<br/>
                    Veuillez confirmer la bonne réception du remboursement.
                </NextStepAdvice> : null
            }
            {isStatus("moneySent") && (userRole === USER_ROLES.SELLER || adminView) ?
                <NextStepAdvice color="info">
                    Nous avons indiqué au testeur que le remboursement a été envoyé.<br/>
                    Il doit maintenant confirmer la bonne réception de celui-ci sur son compte Paypal.
                </NextStepAdvice> : null
            }
            {isStatus("testCancelled") && test.cancelReason ?
                <>
                    <Label>{t("CLAIM_CANCELLATION_REASON")} :</Label>
                    <Alert color="danger">
                        <br/>
                        <i className="white-space-pre-line">{test.cancelReason}</i><br/><br/>
                        {t("ADMIN_WILL_MANAGE")}
                    </Alert>
                </> : null
            }
            {test.adminMessage ?
                <>
                    <Label>{t("ADMIN_MESSAGE")} :</Label>
                    <Alert color="warning">
                        <span className="white-space-pre-line">{test.adminMessage}</span>
                    </Alert>
                </> : null}
        </>
    )
};

TestProcessInfo.propTypes = {
    test: PropTypes.object.isRequired,
    userRole: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired,
    adminView: PropTypes.bool
};

export default withTranslation()(TestProcessInfo);