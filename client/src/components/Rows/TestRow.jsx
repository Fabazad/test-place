import React, {useState} from "react";
import PropTypes from "prop-types";
import constants from "../../helpers/constants";
import {Link} from "react-router-dom";
import {Badge, Media} from "reactstrap";
import {formatDate, textSlice} from "../../helpers/textHelpers";
import TestStatusIcon from "../TestStatusIcon";
import CancelTestRequestButton from "../Buttons/CancelTestRequestButton";
import RowActionButton from "../Buttons/RowActionButton";
import testServices from "../../services/test.services";
import {getProductAmazonUrl} from "../../helpers/urlHelpers";
import confirmHelper from "../../helpers/confirmHelper";
import {toast} from "react-toastify";

const {USER_ROLES, TEST_GLOBAL_STATUSES, TEST_ROW_CLICK_ACTIONS} = constants;

const TestRow = props => {

    const {test, userRole, globalStatus, onClick} = props;

    const [statuses, setStatuses] = useState({});
    testServices.getTestStatuses().then(statuses => setStatuses(statuses));

    if (!test || !userRole || !globalStatus) return null;

    const handleClick = (testId, action) => {
        if (onClick) {
            onClick(testId, action);
        }
    };

    const actionService = (status, successToast) => {
        testServices.updateStatus(test._id, status)
            .then(() => {
                testServices.testsSubject.next();
                toast.success(successToast)
            })
    };

    const confirmAction = action => {
        const actionsMapping = {
            [TEST_ROW_CLICK_ACTIONS.PRODUCT_RECEIVED]: {
                text: "Vous êtes sur le point de confirmer que vous avez bien reçu le produit. Vous êtes donc actuellement en sa possession.",
                status: statuses['productReceived'],
                successTest: "Produit enregistré comme reçu."
            },
            [TEST_ROW_CLICK_ACTIONS.PRODUCT_REVIEWED]: {
                text: "Vous êtes sur le point de confirmer que vous avez bien noté le produit sur Amazon.",
                status: statuses['productReviewed'],
                successTest: "Produit enregistré comme noté."
            }
        };

        const actionData = actionsMapping[action];
        if (actionData) {
            confirmHelper.confirm(actionData.text, () => actionService(actionData.status, actionData.successTest));
        }
    };

    return (
        <tr>
            <td scope="row">
                <Link to={'/ad/' + test.product._id}>
                    <Media className="align-items-center">
                        <div className="avatar rounded-circle mr-3 bg-transparent shadow">
                            <img className="shadow" alt="..."
                                 src={test.product.imageUrls[0].replace(/^(.+)(\.jpg)/, "$1._SS40_$2")}
                            />
                        </div>
                        <Media>
                            <span className="mb-0 text-sm">
                                {textSlice(test.product.title, 25)}
                            </span>
                        </Media>
                    </Media>
                </Link>
            </td>
            <td>
                <h3><Badge color={'primary'}>{test.product.price}€</Badge></h3>
            </td>
            <td>
                <h3>
                    <Badge
                        color={test.product.finalPrice > 0 ? 'warning' : 'success'}>{test.product.finalPrice}€</Badge>
                </h3>
            </td>
            <td>
                {userRole === USER_ROLES.TESTER ? test.seller.name : null}
                {userRole === USER_ROLES.SELLER ? test.tester.name : null}
            </td>
            <td>
                <Badge color={'info'} className={'badge-circle badge-lg text-center p-0'} pill>
                    {formatDate(test.createdAt)}
                </Badge>
            </td>
            <td>
                <TestStatusIcon status={test.status} globalStatus={globalStatus}/>
            </td>
            <td>
                <div className="avatar-group pl-3">
                    {globalStatus === TEST_GLOBAL_STATUSES.REQUESTED ? (
                        <>
                            {test.status === statuses.requested && userRole === USER_ROLES.TESTER ? (
                                <CancelTestRequestButton testId={test._id}/>) : null}
                            <RowActionButton
                                title={"Voir"} icon="fa fa-eye" color={"info"}
                                onClick={() => handleClick(test._id, TEST_ROW_CLICK_ACTIONS.SHOW_TEST_REQUEST)}/>
                        </>
                    ) : null}

                    {globalStatus === TEST_GLOBAL_STATUSES.PROCESSING ? (
                        <>
                            <RowActionButton color={'info'} icon='fa fa-eye' title={'Voir'}
                                onClick={() => handleClick(test.id, TEST_ROW_CLICK_ACTIONS.SHOW_PROCESSING_TEST)}/>

                            {userRole === USER_ROLES.TESTER ? (
                                <>
                                    {test.status === statuses["requestAccepted"] ? (
                                        <RowActionButton
                                            title="Acheter le produit" icon="fab fa-amazon" color="default"
                                            onClick={() => window.open(getProductAmazonUrl(test.product.asin), '_blank')}/>
                                    ) : null}
                                    {test.status === statuses["requestAccepted"] ? (
                                        <RowActionButton
                                            title="Produit commandé" icon="fa fa-shopping-cart" color="warning"
                                            onClick={() => handleClick(test._id, TEST_ROW_CLICK_ACTIONS.PRODUCT_ORDERED)}/>
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

                        </>
                    ) : null}


                </div>
            </td>
        </tr>
    );
};

TestRow.propTypes = {
    test: PropTypes.object.isRequired,
    userRole: PropTypes.string.isRequired,
    globalStatus: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default TestRow;