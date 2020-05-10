import PropTypes from "prop-types";
import CancelTestRequestButton from "./CancelTestRequestButton";
import RowActionButton from "./RowActionButton";
import {getAmazonProfileUrl, getProductAmazonUrl} from "../../helpers/urlHelpers";
import React from "react";
import constants from "../../helpers/constants";
import testServices from "../../services/test.services";
import {toast} from "react-toastify";
import confirmHelper from "../../helpers/confirmHelper";

const {TEST_GLOBAL_STATUSES, TEST_ROW_CLICK_ACTIONS, USER_ROLES} = constants;

const TestListButtons = props => {

    const {globalStatus, test, userRole, onClick, statuses} = props;

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
                text: "Vous êtes sur le point de confirmer que vous avez bien reçu le produit. Vous êtes donc actuellement en sa possession.",
                status: statuses['productReceived'],
                successTest: "Produit enregistré comme reçu."
            },
            [TEST_ROW_CLICK_ACTIONS.PRODUCT_REVIEWED]: {
                text: "Vous êtes sur le point de confirmer que vous avez bien noté le produit sur Amazon. Vous recevrez votre remboursement lorque le Vendeur aura confirmé votre avis.",
                status: statuses['productReviewed'],
                successTest: "Produit enregistré comme noté."
            },
            [TEST_ROW_CLICK_ACTIONS.REVIEW_VALIDATED]: {
                text: "Vous allez confirmer que le Testeur a bien laissé un avis validé par Amazon et qu'il correspond à vos attentes. Il recevra ainsi son remboursement.",
                status: statuses['reviewValidated'],
                successTest: "Avis Validé."
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
                    {test.status === statuses.requested && userRole === USER_ROLES.TESTER ? (
                        <CancelTestRequestButton testId={test._id}/>) : null}
                    <RowActionButton
                        title="Voir" icon="fa fa-eye" color="info"
                        onClick={() => onClick(TEST_ROW_CLICK_ACTIONS.SHOW_TEST)}/>
                </>
            ) : null}

            {globalStatus === TEST_GLOBAL_STATUSES.PROCESSING ? (
                <>
                    <RowActionButton
                        color='info' icon='fa fa-eye' title='Voir'
                        onClick={() => onClick(TEST_ROW_CLICK_ACTIONS.SHOW_TEST)}/>

                    {userRole === USER_ROLES.TESTER ? (
                        <>
                            {test.status === statuses["requestAccepted"] ? (
                                <RowActionButton
                                    title="Acheter le Produit" icon="fab fa-amazon" color="default"
                                    onClick={() => window.open(getProductAmazonUrl(test.product.asin), '_blank')}/>
                            ) : null}
                            {test.status === statuses["requestAccepted"] ? (
                                <RowActionButton
                                    title="Produit Commandé" icon="fa fa-shopping-cart" color="warning"
                                    onClick={() => onClick(TEST_ROW_CLICK_ACTIONS.PRODUCT_ORDERED)}/>
                            ) : null}
                            {test.status === statuses["productOrdered"] ? (
                                <RowActionButton
                                    title="Produit Reçu" icon="fa fa-box-open" color="warning"
                                    onClick={() => confirmAction(TEST_ROW_CLICK_ACTIONS.PRODUCT_RECEIVED)}/>
                            ) : null}

                            {test.status === statuses["productReceived"] ? (
                                <RowActionButton
                                    title="Produit Noté" icon="fa fa-star" color="warning"
                                    onClick={() => confirmAction(TEST_ROW_CLICK_ACTIONS.PRODUCT_REVIEWED)}/>
                            ) : null}
                        </>
                    ) : null}

                    {userRole === USER_ROLES.SELLER ? (
                        <>
                            {test.status === statuses["productReviewed"] ? (
                                <>
                                    <RowActionButton
                                        title="Profil Amazon" icon="fab fa-amazon" color="default"
                                        onClick={() => window.open(getAmazonProfileUrl(test.tester.amazonId), '_blank')}/>
                                    <RowActionButton
                                        title="Refuser l'Avis" icon="fa fa-thumbs-down"
                                        color="danger" onClick={() => onClick(TEST_ROW_CLICK_ACTIONS.REVIEW_DECLINED)}/>
                                    <RowActionButton
                                        title="Valider l'Avis" icon="fa fa-thumbs-up" color="success"
                                        onClick={() => confirmAction(TEST_ROW_CLICK_ACTIONS.REVIEW_VALIDATED)}/>
                                </>
                            ) : null}
                        </>
                    ) : null}

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

export default TestListButtons;